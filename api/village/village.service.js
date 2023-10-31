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
    getAll(query) {
        const filters = this.generateFilters(query);
        return Village.findAll(filters);
    }

    /**
     * Returns a village by id
     * @param {Number} id
     * @param {Object} query
     * @returns {Promise<Village>}
     */
    getById(id, query) {
        const filters = this.generateFilters(query);
        return Village.findByPk(id, filters);
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
     * @param {Object} query
     * @returns {Object}
     */
    generateFilters(query) {
        const filters = {
            include: [],
            where: {}
        };

        if (query.resources)
        {
            filters.include.push({
                model: Village_resource,
            });
        }

        if (query.buildings)
        {
            filters.include.push({
                model: Village_building,
            });
        }

        if (query.units)
        {
            filters.include.push({
                model: Village_unit,
            });
        }

        if (query.civilization)
        {
            filters.include.push({
                model: Civilization,
            });
        }

        if (query.user)
        {
            filters.include.push({
                model: User,
                attributes: {
                    exclude: ['password']
                },
            });
        }

        if (query.server)
        {
            filters.include.push({
                model: Server,
            });
        }

        return filters;
    }
}

module.exports = new VilageService();