const NotFoundError = require('../../errors/not-found');

const { Village } = require('../../database').models;
 
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
     * @returns {Promise<Village>}
     */
    create(data) {
        return Village.create(data);
    }

    /**
     * Updates a village
     * @param {Number} id 
     * @param {Object} data 
     * @returns {Promise<Village>}
     */
    update(id, data) {
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
        const Village = await Village.findByPk(id);

        if (!Village) 
        {
            throw new NotFoundError(`Village with id ${id} not found`);
        }

        return Village.destroy();
    }
}

module.exports = new VilageService();