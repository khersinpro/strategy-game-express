const NotFoundError = require('../../errors/not-found');
const Defense_type  = require('../../database/models/defense_type');

class DefenseTypeService {
    /**
     * Return all defense types
     * @returns {Promise<Defense_type[]>}
     */
    getAll() {
        return Defense_type.findAll();
    }

    /**
     * Return all defense types for a specific unit
     * @param {String} unitName 
     * @returns {Promise<Defense_type[]>}
     */
    getByUnitName(unitName) {
        return Defense_type.findAll({
            where: {
                unit_name: unitName
            }
        });
    }

    /**
     * Return a defense type by id
     * @param {String} unitName
     * @param {String} defenseType
     * @returns {Promise<Defense_type>}
     */
    getByNameAndType(unitName, defenseType) {
        return Defense_type.findOne({
            where: {
                unit_name: unitName,
                type: defenseType
            }
        });
    }

    /**
     * Creates a new defense type
     * @param {Object} data
     * @returns {Promise<Defense_type>}
     */ 
    create(data) {
        return Defense_type.create(data);
    }

    /**
     * Updates a defense type
     * @param {String} unitName
     * @param {String} defenseType
     * @param {Object} data
     * @returns {Promise<Defense_type>}
     */ 
    update(unitName, defenseType, data) {
        return Defense_type.update(data, {
            where: {
                unit_name: unitName,
                type: defenseType
            }
        });
    }

    /**
     * Delete a defense type
     * @param {String} unitName
     * @param {String} defenseType
     * @throws {NotFoundError} if defense type not found
     * @returns {Promise<Defense_type>}
     */
    async delete(unitName, defenseType) {
        const defense = await this.getByNameAndType(unitName, defenseType);

        if (!defense) {
            throw new NotFoundError(`Defense type with name ${unitName} and type ${defenseType} not found`);
        }

        return defense.destroy();
    }
}

module.exports = new DefenseTypeService();