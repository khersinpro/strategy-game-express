const BadRequestError = require('../../errors/bad-request');

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
     * @param {String} type 
     * @returns 
     */
    getByType(type) {
        return Unit_type.findByPk(type);
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
     * @param {String} type 
     * @param {Object} data 
     * @returns {Promise<Unit_type>}
     */
    update(type, data) {
        return Unit_type.update(data, {
            where: {
                type: type
            }
        });
    }

    /**
     * Deletes a unitType
     * @param {String} type
     * @returns {Promise<Unit_type>}
     */ 
    async delete(type) {
        const UnitType = await this.getByType(type);

        if (!UnitType) 
        {
            throw new NotFoundError(`UnitType with type ${type} not found`);
        }

        return UnitType.destroy();
    }
}

module.exports = new UnitTypeService();