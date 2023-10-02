const NotFoundError = require('../../errors/not-found.js');
const { Unit } = require('../../database/index.js').models;

class UnitService {
    /**
     * Returns all unitTypes
     * @returns {Promise<Unit[]>}
     */
    getAll() {
        return Unit.findAll();
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