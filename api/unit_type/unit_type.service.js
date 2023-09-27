const { Unit_type } = require('../../database').models;

class UnitTypeService {
    /**
     * Returns all unitTypes
     * @returns {Promise<Unit_type[]>}
     */
    getAll() {
        return Unit_type.findAll();
    }

    /**
     * Returns a unitType by id
     * @param {Number} id
     * @returns {Promise<Unit_type>}
     */
    getById(id) {
        return Unit_type.findByPk(id);
    }   

    /**
     * Creates a new unitType promise
     * @param {Object} data
     * @returns {Promise<Unit_type>}
     */
    create(data) {
        return Unit_type.create(data);
    }

    /**
     * Updates a unitType
     * @param {Number} id 
     * @param {Object} data 
     * @returns {Promise<Unit_type>}
     */
    update(id, data) {
        return Unit_type.update(data, {
            where: {
                id: id
            }
        });
    }

    /**
     * Deletes a unitType
     * @param {Number} id
     * @returns {Promise<Unit_type>}
     */ 
    async delete(id) {
        const UnitType = await Unit_type.findByPk(id);

        if (!UnitType) 
        {
            throw new NotFoundError(`UnitType with id ${id} not found`);
        }

        return UnitType.destroy();
    }
}

module.exports = new UnitTypeService();