const { Op }                        = require('sequelize');
const NotFoundError                 = require('../../../errors/not-found');
const { sequelize }                 = require('../../../database/index');
const Village_building              = require('../../../database/models/village_building');
const Village_construction_progress = require('../../../database/models/village_construction_progress');
const Village_new_construction      = require('../../../database/models/village_new_construction');
const Village_update_construction   = require('../../../database/models/village_update_construction');
const Building                      = require('../../../database/models/building');

class VillageBuildingService {
    /**
     * Returns buildings of all villages
     * @returns {Promise<Village_building>}
     */
    getAll() {
        return Village_building.findAll();
    }

    /**
     * Returns buildings of a village
     * @param {Number} id village building id 
     * @throws {NotFoundError} when village building not found
     * @returns {Promise<Village_building>}
     */ 
    async getById(id) {
        const villageBuilding = await Village_building.findByPk(id);

        if (!villageBuilding)
        {
            throw new NotFoundError('Village building not found')
        }

        return villageBuilding;
    }

    /**
     * Return created village building promise
     * @param {Object} data village data
     * @returns {Promise<Village_building>}
     */ 
    create(data) {
        return Village_building.create(data);
    }

    /**
     * Return updated village building promise
     * @param {Number} id village building id
     * @param {Object} data village building data
     * @return {Promise<Village_building>}
     */
    update(id, data) {
        return Village_building.update(data, {
            where: {
                id: id
            }
        });
    }

    /**
     * Return deleted village building promise
     * @param {Number} id village building id
     * @throws {NotFoundError} when village building not found
     * @returns {Promise<Village_building>}
     */ 
    async delete(id) {
        const villageBuilding = await this.getById(id);
        return villageBuilding.destroy();
    }

    /**
     * Create buildings for one village when the village construction progress of the village is finished
     * @param {Number} villageId - The village id
     * @param {Date} - The construction end date limit
     * @return {Promise<sequelize.transaction>} transaction promise
     */
    async createUniqueVillageBuildingWhenConstructionProgressIsFinished (villageId, ConstructionEnd = new Date()) {
        const transaction = await sequelize.transaction();
        try
        {
            const villageNewConstructions = await Village_construction_progress.findAll({
                include: [
                    {
                        model: Village_new_construction,
                        required: true,
                    }
                ],
                where: {
                    type: 'village_new_construction',
                    village_id: villageId,
                    enabled: true,
                    archived: false,
                    construction_end: {
                        [Op.lte]: ConstructionEnd
                    }
                }
            })

            if (villageNewConstructions.length)
            {
                await this.createVillageBuildingLoopsAndDisableVillageConstructionProgress(villageNewConstructions, transaction)
            }

            return transaction.commit();
        }
        catch (error)
        {
            await transaction.rollback();
            throw error;
        }
    }    

    /**
     * Update buildings for one village when the village construction progress of the village is finished
     * @param {Number} villageId - The village id
     * @param {Date} - The construction end date limit
     * @return {Promise<sequelize.transaction>} transaction promise
     */
    async updateUniqueVillageBuildingWhenConstructionProgressIsFinished (villageId, ConstructionEnd = new Date()) {
        const transaction = await sequelize.transaction();
        try
        {
            const villageUpdateConstructions = await Village_construction_progress.findAll({
                include: [
                    {
                        model: Village_update_construction,
                        required: true,
                    }
                ],
                where: {
                    type: 'village_update_construction',
                    village_id: villageId,
                    enabled: true,
                    archived: false,
                    construction_end: {
                        [Op.lte]: ConstructionEnd
                    }
                }
            })

            if (villageUpdateConstructions.length)
            {
                await this.updateVillageBuildingLoopsAndDisableVillageConstructionProgress(villageUpdateConstructions, transaction)
            }
            
            return transaction.commit();
        }
        catch (error)
        {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Create buildings for all villages when the village construction progress is finished
     * @return {Promise<sequelize.transaction>} transaction promise
     */
    async createAllVillageBuildingWhenConstructionProgressIsFinished () {
        const transaction = await sequelize.transaction();
        try
        {
            const allVillageNewConstructions = await Village_construction_progress.findAll({
                include: [
                    {
                        model: Village_new_construction,
                        required: true,
                    }
                ],
                where: {
                    type: 'village_new_construction',
                    enabled: true,
                    archived: false,
                    construction_end: {
                        [Op.lte]: new Date()
                    }
                }
            })

            if (allVillageNewConstructions.length)
            {
                await this.createVillageBuildingLoopsAndDisableVillageConstructionProgress(allVillageNewConstructions, transaction)
            }

            return transaction.commit();
        }
        catch (error)
        {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Update buildings for all villages when the village construction progress is finished
     * @return {Promise<sequelize.transaction>} transaction promise
     */
    async updateAllVillageBuildingWhenConstructionProgressIsFinished () {
        const transaction = await sequelize.transaction();
        try
        {
            const allVillageUpdateConstructions = await Village_construction_progress.findAll({
                include: [
                    {
                        model: Village_update_construction,
                        required: true,
                    }
                ],
                where: {
                    type: 'village_update_construction',
                    enabled: true,
                    archived: false,
                    construction_end: {
                        [Op.lte]: new Date()
                    }
                }
            })

            if (allVillageUpdateConstructions.length)
            {
                await this.updateVillageBuildingLoopsAndDisableVillageConstructionProgress(allVillageUpdateConstructions, transaction)
            }

            return transaction.commit();
        }
        catch (error)
        {
            await transaction.rollback();
            throw error;
        }
    }    

    /**
     * Create village building loops and disabled village_construction_progress
     * @param {Village_construction_progress[]} villageNewConstructions village new constructions
     * @param {sequelize.transaction} transaction transaction
     * @returns {Promise<Village_building[]>} village building promises
     */
    async createVillageBuildingLoopsAndDisableVillageConstructionProgress (villageNewConstructions, transaction) {
        try
        {
            if (!villageNewConstructions || !villageNewConstructions.length)
            {
                throw new Error('No village new construction found in createVillageBuildingLoopsAndDisableVillageConstructionProgress function')
            }

            if (!transaction)
            {
                throw new Error('No transaction found in createVillageBuildingLoopsAndDisableVillageConstructionProgress function')
            }

            const newConstructionPromises = []

            for (const villageNewConstruction of villageNewConstructions)
            {
                const building = await Building.findByPk(villageNewConstruction.Village_new_construction.building_name);
                
                const newConstructionPromise = Village_building.create({
                    village_id: villageNewConstruction.village_id,
                    type: building.type,
                    building_name: villageNewConstruction.Village_new_construction.building_name,
                    building_level_id: villageNewConstruction.Village_new_construction.building_level_id
                }, { transaction })

                villageNewConstruction.enabled  = false
                villageNewConstruction.archived = true
                await villageNewConstruction.save({ transaction })
                newConstructionPromises.push(newConstructionPromise)
            }

            return Promise.all(newConstructionPromises)
        }
        catch (error)
        {
            throw error;
        }
    }

    /**
     * Update village building loops and disabled village_construction_progress
     * @param {Village_construction_progress[]} villageUpdateConstructions village update constructions
     * @param {sequelize.transaction} transaction transaction
     * @returns {Promise<Village_building[]>} village building promises
     */
    async updateVillageBuildingLoopsAndDisableVillageConstructionProgress (villageUpdateConstructions, transaction) {
        try 
        {
            if (!villageUpdateConstructions || !villageUpdateConstructions.length)
            {
                throw new Error('No village update construction found in updateVillageBuildingLoopsAndDisableVillageConstructionProgress function')
            }

            if (!transaction)
            {
                throw new Error('No transaction found in updateVillageBuildingLoopsAndDisableVillageConstructionProgress function')
            }

            const updateConstructionPromises = []
        
            for (const villageUpdateConstruction of villageUpdateConstructions)
            {
                const updateConstructionPromise = Village_building.update({
                    building_level_id: villageUpdateConstruction.Village_update_construction.building_level_id
                }, {
                    where: {
                        id: villageUpdateConstruction.Village_update_construction.village_building_id
                    },
                    transaction
                })

                villageUpdateConstruction.enabled  = false
                villageUpdateConstruction.archived = true
                await villageUpdateConstruction.save({ transaction })
                updateConstructionPromises.push(updateConstructionPromise)
            }

            await Promise.all(updateConstructionPromises)
        }
        catch (error)
        {
            throw error;
        }
    }
}

module.exports = new VillageBuildingService();