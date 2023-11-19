const ForbiddenError    = require('../../../errors/forbidden');
const NotFoundError     = require('../../../errors/not-found');
const sequelize         = require('../../../database/index').sequelize;
const VillageService    = require('../village.service');
const BuildingService   = require('../../building/building.service');
const BuildingCostService = require('../../building/building_cost/building_cost.service');
const { Op } = require('sequelize');
const { 
    Village_construction_progress, 
    Village_update_construction, 
    Village_new_construction, 
    Village_building, 
    Building_level, 
    Building_cost, 
    Village_resource 
} = require('../../../database/index').models;

class VillageProductionProgressService {

    /**
     * Returns unit of all village_production_progresss
     * @returns {Promise<Village_construction_progress>}
     */
    getAll() {
        return Village_construction_progress.findAll();
    }

    /**
     * Returns unit of a village_production_progresss by id
     * @param {Number} id village_production_progresss village_production_progresss id 
     * @throws {NotFoundError} when village_production_progresss not found
     * @returns {Promise<Village_construction_progress>}
     */ 
    async getById(id) {
        const villageProductionProgress = await Village_construction_progress.findByPk(id);

        if (!villageProductionProgress)
        {
            throw new NotFoundError('Village unit not found')
        }

        return villageProductionProgress;
    }

    /**
     * Return created village_production_progresss promise
     * @param {Object} data village_production_progresss data
     * @returns {Promise<Village_construction_progress>}
     */ 
    create(data) {
        return Village_construction_progress.create(data);
    }

    /**
     * Create a new village_production_progresss with type village_new_construction and his associated village_new_building
     * @param {Object} data village_production_progresss data
     * @param data.village_id id of the village
     * @param data.building_name name of the building to be constructed
     * @throws {NotFoundError} when resource not found
     * @throws {ForbiddenError} when user user is not allowed to do this action
     * @returns {Promise<Village_construction_progress>}
     */ 
    async createNewConstructionProgress(data, currentUser) {
        const resourceTransaction = await sequelize.transaction();
        try
        {
            // check if the village exists, if not throw NotFoundError
            const village = await VillageService.getById(data.village_id, { user: 1})
    
            // check if current user has the ownership of the village or if he is an admin, if not throw ForbiddenError
            village.isAdminOrVillageOwner(currentUser);
  
            // check if building exists, if not throw NotFoundError
            const existingBuilding = await BuildingService.getByName(data.building_name);

            if (!existingBuilding)
            {
                throw new NotFoundError('Building not found');
            }

            // check if village_building already exists in the village, if yes throw ForbiddenError
            const existingVillageBuilding = await Village_building.findOne({
                where: {
                    village_id: data.village_id,
                    building_name: data.building_name
                }                
            });

            if (existingVillageBuilding)
            {
                throw new ForbiddenError('Building already exists in the village');
            }

            // check if building construction in progress, if yes throw ForbiddenError
            const existingVillageConstructionInProgress = await Village_construction_progress.findOne({
                include: [
                    {
                        model: Village_new_construction,
                        required: true,
                        where: {
                            building_name: data.building_name
                        }
                    }
                ],
                where: {
                    village_id: data.village_id,
                    enabled: true,
                    archived: false
                }
            });

            if (existingVillageConstructionInProgress)
            {
                throw new ForbiddenError('Building construction already in progress');
            }

            // get the first level of the building and his construction cost
            const buildingFirstLevelAndCost = await Building_level.findOne({
                include: [
                    {
                        model: Building_cost,
                        required: true
                    }
                ],
                where: {
                    building_name: data.building_name,
                    level: 1
                }
            });

            if (!buildingFirstLevelAndCost) 
            {
                throw new NotFoundError('Building level not found');
            } 
            else if (!buildingFirstLevelAndCost.Building_costs.length)
            {
                throw new NotFoundError('Building cost not found');
            }
    
            const villageResources = await Village_resource.findAll({
                where: {
                    village_id: data.village_id
                }
            });
            
            if (!villageResources.length)
            {
                throw new NotFoundError('Village resources not found');
            }
            
            
            // check if village has enough resources and save new village_resource, if not throw ForbiddenError
            await BuildingCostService.checkAndUpdateResourcesBeforeCreate(villageResources, buildingFirstLevelAndCost.Building_costs, resourceTransaction);

            // generate the start date of the construction and the end date with the timestamp of the start date + the construction duration
            const lastBuildingConstructionProgressDate = await Village_construction_progress.findOne({
                attributes: ['construction_end'],
                where: {
                    village_id: data.village_id,
                    enabled: true,
                    archived: false
                },
                order: [
                    ['construction_end', 'DESC']
                ]
            });
            // Check if there's a last construction end date
            const hasLastConstructionEndDate            = lastBuildingConstructionProgressDate && lastBuildingConstructionProgressDate.construction_end;
            const startDate                             = hasLastConstructionEndDate ? new Date(lastBuildingConstructionProgressDate.construction_end) : new Date();
            const starDateInMilliseconds                = startDate.getTime();
            const constructionDurationInMilliseconds    = buildingFirstLevelAndCost.time * 1000;
            const endDate                               = new Date(starDateInMilliseconds + constructionDurationInMilliseconds);
    
            // create a new village_constructoin_progresss with the start date and the end date
            const villageConstructionProgress = await Village_construction_progress.create({
                type: 'village_new_construction',
                construction_start: startDate,
                construction_end: endDate,
                village_id: data.village_id
            })

            if (!villageConstructionProgress)
            {
                throw new Error('Village production progress not created');
            }

            // create the associated village_new_construction
            const villageNewConstruction = await Village_new_construction.create({
                id: villageConstructionProgress.id,
                building_name: data.building_name,
                building_level_id: buildingFirstLevelAndCost.id
            });

            if (!villageNewConstruction)
            {
                await villageConstructionProgress.destroy();
                throw new Error('Village new construction not created');
            }
    
            // set the village_new_building to the village_new_construction with setDataValue
            villageConstructionProgress.setDataValue('village_new_construction', villageNewConstruction);
    
            // commit transaction
            await resourceTransaction.commit();
    
            // return the village_update_construction
            return villageConstructionProgress;
        }
        catch (error)
        {
            await resourceTransaction.rollback();
            throw error;
        }
    }

    /**
     * Create a new village_production_progresss with type village_update_construction and his associated village_update_building
     * @param {Object} data village_production_progresss data
     * @param data.village_id id of the village
     * @param data.village_building_id id of the village_building to be updated
     * @returns {Promise<Village_construction_progress>}
     */
    async createUpdateConstructionProgress(data, currentUser) {
        const resourceTransaction = await sequelize.transaction();
        try
        {
            // check if the village exists, if not throw NotFoundError
            const village = await VillageService.getById(data.village_id, { user: 1})

            // check if current user has the ownership of the village or if he is an admin, if not throw ForbiddenError
            village.isAdminOrVillageOwner(currentUser);

            // check if village_building already exists, if not trhow NotFoundError
            const villageBuilding = await Village_building.findOne({
                include: [
                    {
                        model: Building_level,
                        required: true
                    }
                ],
                where: {
                    id: data.village_building_id,
                    village_id: data.village_id
                }
            });

            if (!villageBuilding)
            {
                throw new NotFoundError('Village building not found or building level not found');
            }

            // check if building has already an update in progress and get the last update progress
            const sameBuildingUpdateInProgress = await Village_construction_progress.findOne({
                include: [
                    {
                        model: Village_update_construction,
                        where: {
                            village_building_id: data.village_building_id
                        }, 
                        include: [
                            {
                                model: Building_level, 
                                required: true
                            }
                        ]
                    }
                ],
                where: {
                    village_id: data.village_id,
                    enabled: true,
                    archived: false
                },             
                order: [
                    ['construction_end', 'DESC']
                ]
            });

            // get the next level of the building, if build as already an update in progress, get the next level of the update
            const buildingLevelParams           = {}
            const actualBuildingLevel           = sameBuildingUpdateInProgress ? sameBuildingUpdateInProgress.Village_update_construction.Building_level : villageBuilding.Building_level;
            buildingLevelParams.level           = actualBuildingLevel.level + 1;
            buildingLevelParams.building_name   = actualBuildingLevel.building_name;

            const buildingNextLevel = await Building_level.findOne({
                include: [
                    {
                        model: Building_cost, 
                        required: true
                    }
                ],
                where: buildingLevelParams
            });

            if (!buildingNextLevel)
            {   
                throw new NotFoundError('Next building level not found or building cost not found');
            }

            // get the building update cost for all resources
            const buildingUpdateCosts = buildingNextLevel.Building_costs;

            // get the village resources
            const villageResources = await Village_resource.findAll({
                where: {
                    village_id: data.village_id
                }
            });

            if (!villageResources.length)
            {
                throw new NotFoundError('Village resources not found');
            }

            // check if village has enough resources and save, if not throw ForbiddenError
            await BuildingCostService.checkAndUpdateResourcesBeforeCreate(villageResources, buildingUpdateCosts, resourceTransaction);

            // generate the start date of the update and the end date with the timestamp of the start date + the update duration
            const lastVillageUpdateProgress = await Village_construction_progress.findOne({
                attributes: ['construction_end'],
                where: {
                    village_id: data.village_id,
                    enabled: true,
                    archived: false
                },
                order: [
                    ['construction_end', 'DESC']
                ]
            });

            const hasUpdateInProgress                   = lastVillageUpdateProgress && lastVillageUpdateProgress.construction_end;
            const startDate                             = hasUpdateInProgress ? new Date(lastVillageUpdateProgress.construction_end) : new Date();
            const starDateInMilliseconds                = startDate.getTime();
            const constructionDurationInMilliseconds    = buildingNextLevel.time * 1000;
            const endDate                               = new Date(starDateInMilliseconds + constructionDurationInMilliseconds);

            // create a new village_production_progresss with the start date and the end date
            const villageConstructionProgress = await Village_construction_progress.create({
                type: 'village_update_construction',
                construction_start: startDate,
                construction_end: endDate,
                village_id: data.village_id
            })

            if (!villageConstructionProgress)
            {
                throw new Error('Village production progress not created');
            }

            // create the associated village_update_construction 
            const villageUpdateConstruction = await Village_update_construction.create({    
                id: villageConstructionProgress.id,
                village_building_id: data.village_building_id,
                building_level_id: buildingNextLevel.id
            });

            if (!villageUpdateConstruction)
            {
                await villageConstructionProgress.destroy();
                throw new Error('Village update construction not created');
            }

            // set the village_update_building to the village_update_construction with setDataValue
            villageConstructionProgress.setDataValue('village_update_construction', villageUpdateConstruction);

            // commit transaction
            await resourceTransaction.commit();

            // return the village_update_construction
            return villageConstructionProgress;
        }
        catch (error)
        {
            await resourceTransaction.rollback();
            throw error;
        }
    }

    async cancelConstructionProgress(id, currentUser) {
        try {
            const constructionToCancel = await Village_construction_progress.findByPk(id, {
                include: [
                    {
                        model: Village_new_construction,
                        required: true
                    }
                ],
                where: {
                    enabled: true,
                    archived: false
                }
            });
    
            if (!constructionToCancel) {
                throw new NotFoundError('Village construction progress not found or not enabled');
            }
    
            const village = await VillageService.getById(constructionToCancel.village_id);
            village.isAdminOrVillageOwner(currentUser);
    
            const constructionInProgress = await Village_construction_progress.findAll({
                where: {
                    village_id: village.id,
                    enabled: true,
                    archived: false,
                    id: {
                        [Op.ne]: constructionToCancel.id
                    }
                },
                order: [
                    ['construction_end', 'ASC']
                ]
            });
    
            if (constructionInProgress.length) {
                const constructionBeforeContructionToCancel = constructionInProgress.filter(construction => construction.construction_end < constructionToCancel.construction_end);
                const constructionAfterContructionToCancel = constructionInProgress.filter(construction => construction.construction_end > constructionToCancel.construction_end);
    
                let nextConstructionStartDate = constructionToCancel.construction_end;
    
                if (constructionBeforeContructionToCancel.length) {
                    const lastConstructionBeforeConstructionToCancel = constructionBeforeContructionToCancel[constructionBeforeContructionToCancel.length - 1];
                    nextConstructionStartDate = lastConstructionBeforeConstructionToCancel.construction_end;
                }
    
                await updateConstructionsDates(constructionAfterContructionToCancel, nextConstructionStartDate);
            }
        } catch (error) {
            throw error;
        }
    }
    
    async updateConstructionsDates(constructions, nextConstructionStartDate) {
        for (const constructionToUpdate of constructions) {
            const constructionTimeLength = constructionToUpdate.construction_end.getTime() - constructionToUpdate.construction_start.getTime();
    
            const newConstructionStartDate = new Date(nextConstructionStartDate);
            const newConstructionEndDate = new Date(newConstructionStartDate.getTime() + constructionTimeLength);
    
            nextConstructionStartDate = newConstructionEndDate;
    
            await constructionToUpdate.update({
                construction_start: newConstructionStartDate,
                construction_end: newConstructionEndDate
            });
        }
    }

    /**
     * Return updated village_production_progresss promise
     * @param {Number} id village_production_progresss id
     * @param {Object} data village_production_progresss data
     * @return {Promise<Village_construction_progress>}
     */
    update(id, data) {
        return Village_construction_progress.update(data, {
            where: {
                id: id
            }
        });
    }

    /**
     * Return deleted village_production_progresss promise
     * @param {Number} id village_production_progresss id
     * @throws {NotFoundError} when village_production_progresss not found
     * @returns {Promise<Village_construction_progress>}
     */ 
    async delete(id) {
        const villageProductionProgress = await this.getById(id);

        if (!villageProductionProgress)
        {
            throw new NotFoundError('Village not found')
        }

        return villageProductionProgress.destroy();
    }
}

module.exports = new VillageProductionProgressService();