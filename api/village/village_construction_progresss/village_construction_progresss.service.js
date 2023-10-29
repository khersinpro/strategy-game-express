const NotFoundError = require('../../../errors/not-found');
const { Village_production_progress } = require('../../../database/index').models;
class VillageProductionProgressService {

    /**
     * Returns unit of all village_production_progresss
     * @returns {Promise<Village_production_progress>}
     */
    getAll() {
        return Village_production_progress.findAll();
    }

    /**
     * Returns unit of a village_production_progresss by id
     * @param {Number} id village_production_progresss village_production_progresss id 
     * @throws {NotFoundError} when village_production_progresss not found
     * @returns {Promise<Village_production_progress>}
     */ 
    async getById(id) {
        const villageProductionProgress = await Village_production_progress.findByPk(id);

        if (!villageProductionProgress)
        {
            throw new NotFoundError('Village unit not found')
        }

        return villageProductionProgress;
    }

    /**
     * Return created village_production_progresss promise
     * @param {Object} data village_production_progresss data
     * @returns {Promise<Village_production_progress>}
     */ 
    create(data) {
        return Village_production_progress.create(data);
    }

    /**
     * Return updated village_production_progresss promise
     * @param {Number} id village_production_progresss id
     * @param {Object} data village_production_progresss data
     * @return {Promise<Village_production_progress>}
     */
    update(id, data) {
        return Village_production_progress.update(data, {
            where: {
                id: id
            }
        });
    }

    /**
     * Return deleted village_production_progresss promise
     * @param {Number} id village_production_progresss id
     * @throws {NotFoundError} when village_production_progresss not found
     * @returns {Promise<Village_production_progress>}
     */ 
    async delete(id) {
        const villageProductionProgress = await this.getById(id);

        if (!villageProductionProgress)
        {
            throw new NotFoundError('Village nit not found')
        }

        return villageProductionProgress.destroy();
    }
}

module.exports = new VillageProductionProgressService();