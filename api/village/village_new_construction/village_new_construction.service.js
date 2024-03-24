const NotFoundError             = require('../../../errors/not-found');
const Village_new_construction  = require('../../../database/models/village_new_construction');

class VillageNewConstructionService {
    /**
     * Return all village_new_construction
     * @returns {Promise<Village_new_construction>}
     */
    getAll() {
        return Village_new_construction.findAll();
    }

    /**
     * Return a village_new_construction by id
     * @param {Number} id village_new_construction village_new_construction id 
     * @throws {NotFoundError} when village_new_construction not found
     * @returns {Promise<Village_new_construction>}
     */ 
    async getById(id) {
        const villageNewConstruction = await Village_new_construction.findByPk(id);

        if (!villageNewConstruction)
        {
            throw new NotFoundError('Village new construction not found')
        }

        return villageNewConstruction;
    }

    /**
     * Return created village_new_construction promise
     * @param {Object} data village_new_construction data
     * @returns {Promise<Village_new_construction>}
     */ 
    create(data) {
        return Village_new_construction.create(data);
    }

    /**
     * Return updated village_new_construction promise
     * @param {Number} id village_new_construction id
     * @param {Object} data village_new_construction data
     * @return {Promise<Village_new_construction>}
     */
    update(id, data) {
        return Village_new_construction.update(data, {
            where: {
                id: id
            }
        });
    }

    /**
     * Return deleted village_new_construction promise
     * @param {Number} id village_new_construction id
     * @throws {NotFoundError} when village_new_construction not found
     * @returns {Promise<Village_new_construction>}
     */ 
    async delete(id) {
        const villageNewConstruction = await this.getById(id);

        if (!villageNewConstruction)
        {
            throw new NotFoundError('Village new construction not found')
        }

        return villageNewConstruction.destroy();
    }
}

module.exports = new VillageNewConstructionService();