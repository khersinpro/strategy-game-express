const NotFoundError = require('../../../errors/not-found');
const { Village_unit } = require('../../../database/index').models;
class VillageUnitService {

    /**
     * Returns unit of all villages
     * @returns {Promise<Village_unit>}
     */
    getAll() {
        return Village_unit.findAll();
    }

    /**
     * Returns unit of a village by id
     * @param {Number} id village village id 
     * @throws {NotFoundError} when village village not found
     * @returns {Promise<Village_unit>}
     */ 
    async getById(id) {
        const villageUnit = await Village_unit.findByPk(id);

        if (!villageUnit)
        {
            throw new NotFoundError('Village unit not found')
        }

        return villageUnit;
    }

    /**
     * Return created village village promise
     * @param {Object} data village data
     * @returns {Promise<Village_unit>}
     */ 
    create(data) {
        return Village_unit.create(data);
    }

    /**
     * Return updated village village promise
     * @param {Number} id village village id
     * @param {Object} data village village data
     * @return {Promise<Village_unit>}
     */
    update(id, data) {
        return Village_unit.update(data, {
            where: {
                id: id
            }
        });
    }

    /**
     * Return deleted village village promise
     * @param {Number} id village village id
     * @throws {NotFoundError} when village village not found
     * @returns {Promise<Village_unit>}
     */ 
    async delete(id) {
        const villageUnit = await this.getById(id);

        if (!villageUnit)
        {
            throw new NotFoundError('Village nit not found')
        }

        return villageUnit.destroy();
    }
}

module.exports = new VillageUnitService();