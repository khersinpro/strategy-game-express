const NotFoundError = require('../../errors/not-found.js');
const Unit = require('../../database/models/unit.js');

class UnitService {
    /**
     * Returns all unitTypes
     * @param {number} limit
     * @param {number} page
     * @returns {Promise<Unit[]>}
     */
    getAll(limit = 20, page = 1) {
        const offset = limit * (page - 1);
        return Unit.findAndCountAll({
            limit,
            offset
        });
    }

    /**
     * Returns a Unit by name
     * @param {String} name 
     * @returns 
     */
    getByName(name) {
        return Unit.findByPk(name);
    }

    /**
     * Creates a new Unit promise
     * @param {Object} data
     * @returns {Promise<Unit>}
     */
    create(data) {
        return Unit.create(data);
    }

    /**
     * Updates a Unit
     * @param {String} name 
     * @param {Object} data 
     * @returns {Promise<Unit>}
     */
    update(name, data) {
        return Unit.update(data, {
            where: {
                name: name
            }
        });
    }

    /**
     * Delete a Unit
     * @param {String} name
     * @returns {Promise<Unit>}
     */ 
    async delete(name) {
        const Unit = await this.getByName(name);

        if (!Unit) 
        {
            throw new NotFoundError(`Unit with name ${name} not found`);
        }

        return Unit.destroy();
    }
}

module.exports = new UnitService();