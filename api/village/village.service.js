const NotFoundError     = require('../../errors/not-found');
const ServerService     = require('../server/server.service');
const Village_resource  = require('../../database/models/village_resource');
const Village_building  = require('../../database/models/village_building');
const Village_unit      = require('../../database/models/village_unit');
const Civilization      = require('../../database/models/civilization');
const User              = require('../../database/models/user');
const Server            = require('../../database/models/server');
const Village           = require('../../database/models/village');

class VilageService {
    /**
     * Returns all villages
     * @returns {Promise<Village[]>}
     */
    getAll(includes, whereparams, currentUser) {
        const filters = this.generateFilters(includes, whereparams, currentUser);
        return Village.findAll(filters);
    }

    /**
     * Returns a village by id
     * @param {Number} id
     * @param {Object} includes
     * @throws {NotFoundError} if the village does not exist
     * @returns {Promise<Village>}
     */
    async getById(id, includes, whereparams, currentUser) {
        try
        {
            const filters = this.generateFilters(includes, whereparams, currentUser);
            const village = await Village.findByPk(id, filters);
    
            if (!village)
            {
                throw new NotFoundError(`Village with id ${id} not found`);
            }
            
            return village;
        }
        catch (error)
        {
            throw error;
        }
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

        village.isAdminOrVillageOwner(user);

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
     * @param {Object} includes optional
     * @param {Object} whereparams optional
     * @param {User} currentUser optional
     * @returns {Object} Object of filters and includes
     */
    generateFilters(includes = {}, whereparams = {}, currentUser = null) {
        const filters = {
            include: [],
            where: {}
        };

        const isUserAdmin = currentUser && currentUser.role_name === 'ROLE_ADMIN';

        if (includes && Object.keys(includes).length)
        {
            if (includes.resources && isUserAdmin)
            {
                filters.include.push({
                    model: Village_resource,
                });
            }
    
            if (includes.buildings && isUserAdmin)
            {
                filters.include.push({
                    model: Village_building,
                });
            }
    
            if (includes.units && isUserAdmin)
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
                const attributes = isUserAdmin ? 
                ['id', 'username', 'email', 'createdAt', 'updatedAt'] 
                : 
                ['id', 'username'];

                filters.include.push({
                    model: User,
                    attributes
                });
            }
    
            if (includes.server)
            {
                filters.include.push({
                    model: Server,
                });
            }
        }

        if (whereparams && Object.keys(whereparams).length)
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