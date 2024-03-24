const NotFoundError                 = require('../../../errors/not-found');
const Village_update_construction   = require('../../../database/models/village_update_construction');    

class VillageUpdateConstructionService {
    /**
     * Returns unit of all village_update_construction
     * @returns {Promise<Village_update_construction>}
     */
    getAll() {
        return Village_update_construction.findAll();
    }

    /**
     * Return a village_update_construction by id
     * @param {Number} id village_update_construction village_update_construction id 
     * @throws {NotFoundError} when village_update_construction not found
     * @returns {Promise<Village_update_construction>}
     */ 
    async getById(id) {
        const villageUpdateContruction = await Village_update_construction.findByPk(id);

        if (!villageUpdateContruction)
        {
            throw new NotFoundError('Village update construction not found')
        }

        return villageUpdateContruction;
    }

    /**
     * Return created village_update_construction promise
     * @param {Object} data village_update_construction data
     * @returns {Promise<Village_update_construction>}
     */ 
    create(data) {
        return Village_update_construction.create(data);
    }

    /**
     * Return updated village_update_construction promise
     * @param {Number} id village_update_construction id
     * @param {Object} data village_update_construction data
     * @return {Promise<Village_update_construction>}
     */
    update(id, data) {
        return Village_update_construction.update(data, {
            where: {
                id: id
            }
        });
    }

    /**
     * Return deleted village_update_construction promise
     * @param {Number} id village_update_construction id
     * @throws {NotFoundError} when village_update_construction not found
     * @returns {Promise<Village_update_construction>}
     */ 
    async delete(id) {
        const villageUpdateContruction = await this.getById(id);

        if (!villageUpdateContruction)
        {
            throw new NotFoundError('Village update construction not found')
        }

        return villageUpdateContruction.destroy();
    }
}

module.exports = new VillageUpdateConstructionService();