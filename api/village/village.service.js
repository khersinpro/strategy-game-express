const NotFoundError = require('../../errors/not-found');
const { Village, Village_building, Village_unit, Village_resource, Civilization, User, Server } = require('../../database').models;
const UserService = require('../user/user.service');
const ServerService = require('../server/server.service');
const ForbiddenError = require('../../errors/forbidden'); 
class VilageService {
    /**
     * Returns all villages
     * @returns {Promise<Village[]>}
     */
    getAll(includes, whereparams) {
        const filters = this.generateFilters(includes, whereparams);
        return Village.findAll(filters);
    }

    /**
     * Returns a village by id
     * @param {Number} id
     * @param {Object} includes
     * @throws {NotFoundError} if the village does not exist
     * @returns {Promise<Village>}
     */
    getById(id, includes, whereparams) {
        const filters = this.generateFilters(includes, whereparams);
        const village = Village.findByPk(id, filters);

        if (!village)
        {
            throw new NotFoundError(`Village with id ${id} not found`);
        }

        return village;
    }   

    /**
     * Creates a new village promise
     * @param {Object} data
     * @throws {NotFoundError} if the user does not exist
     * @returns {Promise<Village>}
     */
    async create(user, data) {
        const server = await ServerService.getByName(data.server_name);

        /**
         * TODO: Check if the user is allowed to create a village on this server
         */

        if (!server)
        {
            throw new NotFoundError(`Server with id ${data.server_id} not found`);
        }

        data.user_id = user.id;

        return Village.create(data);
    }

    /**
     * Updates a village
     * @param {Number} id 
     * @param {Object} data 
     * @returns {Promise<Village>}
     */
    async update(id, data, user) {
        const village = await this.getById(id);

        if (!village)
        {
            throw new NotFoundError(`Village with id ${id} not found`);
        }

        if (user.id !== village.user_id || user.role_name !== 'ROLE_ADMIN')
        {
            throw new ForbiddenError(`You are not allowed to create a village on this server`);
        }

        return Village.update(data, {
            where: {
                id: id
            }
        });
    }

    /**
     * Deletes a village
     * @param {Number} id
     * @throws {NotFoundError} if the village does not exist
     * @returns {Promise<Village>}
     */ 
    async delete(id) {
        const Village = await this.getById(id);

        if (!Village) 
        {
            throw new NotFoundError(`Village with id ${id} not found`);
        }

        return Village.destroy();
    }

    /**
     * Query filters generator
     * @param {Object} includes
     * @param {Object} whereparams
     * @returns {Object}
     */
    generateFilters(includes = {}, whereparams = {}) {
        const filters = {
            include: [],
            where: {}
        };

        if (includes.length)
        {
            if (includes.resources)
            {
                filters.include.push({
                    model: Village_resource,
                });
            }
    
            if (includes.buildings)
            {
                filters.include.push({
                    model: Village_building,
                });
            }
    
            if (includes.units)
            {
                filters.include.push({
                    model: Village_unit,
                });
            }
    
            if (includes.civilization)
            {
                filters.include.push({
                    model: Civilization,
                });
            }
    
            if (includes.user)
            {
                filters.include.push({
                    model: User,
                    attributes: {
                        exclude: ['password']
                    },
                });
            }
    
            if (includes.server)
            {
                filters.include.push({
                    model: Server,
                });
            }
        }

        if (whereparams.length)
        {
            if (whereparams.name)
            {
                filters.where.name = whereparams.name;
            }

            if (whereparams.id)
            {
                filters.where.id = whereparams.id;
            }

            if (whereparams.user_id)
            {
                filters.where.user_id = whereparams.user_id;
            }

            if (whereparams.server_name)
            {
                filters.where.server_name = whereparams.server_name;
            }

            if (whereparams.civilization_name)
            {
                filters.where.civilization_name = whereparams.civilization_name;
            }
        }

        return filters;
    }
}

module.exports = new VilageService();