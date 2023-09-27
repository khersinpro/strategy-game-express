const NotFoundError = require('../../errors/not-found');
const { Server } = require('../../database').models;

class ServerService {
    /**
     * Returns all servers
     * @returns {Promise<Server[]>}
     */
    getAll() {
        return Server.findAll();
    }

    /**
     * Returns a server by name
     * @param {String} name
     * @returns {Promise<Server>}
     */
    getByName(name) {
        return Server.findOne({
            where: {
                name
            }    
        });
    }   

    /**
     * Creates a new server promise
     * @param {Object} data
     * @returns {Promise<Server>}
     */
    create(data) {
        return Server.create(data);
    }

    /**
     * Updates a server
     * @param {String} name 
     * @param {Object} data 
     * @returns {Promise<Server>}
     */
    update(name, data) {
        return Server.update(data, {
            where: {
                name: name
            }
        });
    }

    /**
     * Deletes a server
     * @param {String} name
     * @returns {Promise<Server>}
     */ 
    async delete(name) {
        const server = await Server.findByPk(name);

        if (!server) 
        {
            throw new NotFoundError(`Server with name ${name} not found`);
        }

        return server.destroy();
    }
}

module.exports = new ServerService();