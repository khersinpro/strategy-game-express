const NotFoundError = require('../../errors/not-found');
const { Village } = require('../../database').models;
const UserService = require('../user/user.service');
const ServerService = require('../server/server.service');
const ForbiddenError = require('../../errors/forbidden');
 
class VilageService {
    /**
     * Returns all villages
     * @returns {Promise<Village[]>}
     */
    getAll() {
        return Village.findAll();
    }

    /**
     * Returns a village by id
     * @param {Number} id
     * @returns {Promise<Village>}
     */
    getById(id) {
        return Village.findByPk(id);
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
}

module.exports = new VilageService();