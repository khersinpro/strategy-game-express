const NotFoundError = require('../../../errors/not-found');
const { Village_production_progress, Village_update_progress } = require('../../../database/index').models;
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
     * Return created village_production_progresss promise
     * @param {Object} data village_production_progresss data
     * @returns {Promise<Village_production_progress>}
     */ 
    async createNewConstructionProgress(data) {
        const transaction = await sequelize.transaction();
        try
        {
            // check if the village exists, if not throw NotFoundError
    
            // check if current user has the ownership of the village or if he is an admin, if not throw ForbiddenError
    
            // check if building exists, if not throw NotFoundError
    
            // check if village_building already exists in the village, if yes throw ForbiddenError
    
            // check if building has already an update or a construction in progress, if yes throw ForbiddenError
    
            // get the first level of the building and his construction cost
    
            // check if village has enough resources, if not throw ForbiddenError
    
            // generate the start date of the construction and the end date with the timestamp of the start date + the construction duration
    
            // update village resources
    
            // create a new village_production_progresss with the start date and the end date
    
            // create the associated village_new_construction
    
            // set the village_new_building to the village_new_construction with setDataValue
    
            // commit transaction
            await transaction.commit();
    
            // return the village_update_construction

        }
        catch (error)
        {
            await transaction.rollback();
            throw error;
        }
    }

    async createUpdateConstructionProgress(data) {
        const transaction = await sequelize.transaction();
        try
        {
            // check if the village exists, if not throw NotFoundError

            // check if village_building already exists, if not trhow NotFoundError

            // check if current user has the ownership of the village or if he is an admin, if not throw ForbiddenError

            // check if building has already an update in progress

            // get the next level of the building, if build as already an update in progress, get the next level of the update

            // get the building update cost for all resources

            // check if village has enough resources, if not throw ForbiddenError

            // generate the start date of the update and the end date with the timestamp of the start date + the update duration
            
            // update village resources

            // create a new village_production_progresss with the start date and the end date

            // create the associated village_update_construction 

            // set the village_update_building to the village_update_construction with setDataValue

            // commit transaction
            await transaction.commit();

            // return the village_update_construction


        }
        catch (error)
        {
            await transaction.rollback();
            throw error;
        }
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