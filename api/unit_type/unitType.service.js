const { UnitType } = require('../../database').models;

class UnitTypeService {
    /**
     * Returns all unitTypes
     * @returns {Promise<UnitType[]>}
     */
    getAll() {
        return UnitType.findAll();
    }

    /**
     * Returns a unitType by id
     * @param {Number} id
     * @returns {Promise<UnitType>}
     */
    getById(id) {
        return UnitType.findByPk(id);
    }   

    /**
     * Creates a new unitType promise
     * @param {Object} data
     * @returns {Promise<UnitType>}
     */
    create(data) {
        return UnitType.create(data);
    }

    /**
     * Updates a unitType
     * @param {Number} id 
     * @param {Object} data 
     * @returns {Promise<UnitType>}
     */
    update(id, data) {
        return UnitType.update(data, {
            where: {
                id: id
            }
        });
    }

    /**
     * Deletes a unitType
     * @param {Number} id
     * @returns {Promise<UnitType>}
     */ 
    async delete(id) {
        const UnitType = await UnitType.findByPk(id);

        if (!UnitType) 
        {
            throw new NotFoundError(`UnitType with id ${id} not found`);
        }

        return UnitType.destroy();
    }
}

module.exports = new UnitTypeService();