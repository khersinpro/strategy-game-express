const { Supporting_unit } = require('../../../database/index').models;
const NotFoundError = require('../../../errors/not-found');

class SupportingUnitService {
    /**
     * Return all supporting units
     * @returns {Promise<Array<Supporting_unit>>}
     */
    getAllSupportingUnits() {
        return Supporting_unit.findAll();
    }

    /**
     * Return supporting unit by id
     * @param {number} id - The id of the supporting unit
     * @throws {NotFoundError} - If supporting unit not found
     * @returns {Promise<Supporting_unit>}
     */
    async getSupportingUnitById(id) {
        try
        {
            const supportingUnit = await Supporting_unit.findByPk(id);

            if (!supportingUnit) throw new NotFoundError(`Supporting unit with id: ${id} not found`);

            return supportingUnit;
        }
        catch (error)
        {
            throw error;
        }
    }

    createSupportingUnit(data) {
        return Supporting_unit.create(data);
    }

    updateSupportingUnitById(id, data) {
        return Supporting_unit.update(data, {
            where: {
                id: id
            }
        });
    }

    deleteSupportingUnitById(id) {
        return Supporting_unit.destroy({
            where: {
                id: id
            }
        });
    }
}

module.exports = new SupportingUnitService();