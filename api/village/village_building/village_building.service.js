const { Op } = require('sequelize');
const NotFoundError = require('../../../errors/not-found');
const { sequelize } = require('../../../database/index');
const { 
    Village_building,
    Village_construction_progress,
    Village_new_construction,
    Village_update_construction 
} = require('../../../database/index').models;
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

        if (!villageBuilding)
        {
            throw new NotFoundError('Village building not found')
        }

        return village.destroy();
    }

    /**
     * Create buildings for one village when the village construction progress of the village is finished
     * @param {Number} villageId village id
     * @returns {Promise<Boolean>} true if the buildings are created
     */
    async createUniqueVillageBuildingWhenConstructionProgressIsFinished (villageId) {
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
                        [Op.lte]: new Date()
                    }
                }
            })
            console.log(new Date());
            if (villageNewConstructions.length)
            {
                const newConstructionPromises = []
        
                for (const villageNewConstruction of villageNewConstructions)
                {
                    const newConstructionPromise = Village_building.create({
                        village_id: villageNewConstruction.village_id,
                        building_name: villageNewConstruction.Village_new_construction.building_name,
                        building_level_id: villageNewConstruction.Village_new_construction.building_level_id
                    }, { transaction })

                    villageNewConstruction.enabled  = false
                    villageNewConstruction.archived = true
                    villageNewConstruction.save({ transaction })
                    newConstructionPromises.push(newConstructionPromise)
                }
        
                await Promise.all(newConstructionPromises)
            }

            await transaction.commit();

            return true;
        }
        catch (error)
        {
            await transaction.rollback();
            throw error;
        }
    }    

    /**
     * Update buildings when for one village when the village construction progress of the village is finished
     * @param {Number} villageId village id
     */
    async updateUniqueVillageBuildingWhenConstructionProgressIsFinished (villageId) {
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
                    [Op.lte]: new Date()
                }
            }
        })
    }

    /**
     * Create buildings for all villages when the village construction progress is finished
     */
    async createAllVillageBuildingWhenConstructionProgressIsFinished () {
        const allVillageNewConstructions = await Village_construction_progress.findAll({
            include: [
                {
                    model: Village_update_construction,
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
    }

    /**
     * Update buildings for all villages when the village construction progress is finished
     */
    async updateAllVillageBuildingWhenConstructionProgressIsFinished () {
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
    }    

}

module.exports = new VillageBuildingService();