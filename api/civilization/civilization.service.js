const NotFoundError = require('../../errors/not-found');
const Civilization  = require('../../database/models/civilization');

class CivilizationService {
    /**
     * Return all civilizations in promise
     * @returns {Promise<Civilization[]>}
     */
    getAll() {
        return Civilization.findAll();
    }

    /**
     * Find civilization by its name and return it in promise
     * @param {String} name 
     * @returns {Promise<Civilization>}
     */
    getByName(name) {
        return Civilization.findByPk(name);
    }

    /**
     * Return a new created civilization in promise
     * @param {Object} data 
     * @returns {Promise<Civilization>}
     */
    create(data) {
        return Civilization.create(data);
    }

    /**
     * Return the updated civilization in promise
     * @param {String} name 
     * @param {Object} data 
     * @returns {Promise}
     */
    update(name, data) {  
        return Civilization.update(data, {
            where: {
                name: name
            }
        });
    }

    /**
     * Return the deleted civilization in promise
     * @param {String} name 
     * @throws {NotFoundError} if the civilization does not exist
     * @returns {Civilization}
     */
    async delete(name) {
        const civilization = await this.getByName(name);

        if (!civilization) {
            throw new NotFoundError('Civilization not found');
        }

        return civilization.destroy();
    }
}

module.exports = new CivilizationService();