const ForbiddenError = require('../../../errors/forbidden');
const NotFoundError = require('../../../errors/not-found');
const { Village_construction_progress, Village_update_progress, Village_new_construction, Village_building, Building_level, Building_cost, Village_resource } = require('../../../database/index').models;
const sequelize = require('../../../database/index').sequelize;
const VillageService = require('../village.service');
const BuildingService = require('../../building/building.service');
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
        const transaction = await sequelize.transaction();
        try
        {
            console.log("createNewConstructionProgress step");
            // check if the village exists, if not throw NotFoundError
            const village = await VillageService.getById(data.village_id, { user: 1})

            if (!village)
            {
                throw new NotFoundError('Village not found');
            }
    
            // check if current user has the ownership of the village or if he is an admin, if not throw ForbiddenError
            if (village.user_id !== currentUser.id && currentUser.role_name !== 'ROLE_ADMIN')
            {
                throw new ForbiddenError('You are not allowed to create a building on this village');
            }
    console.log('before existingBuilding step')
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
            console.log("existingBuilding step");
            // check if building construction in progress, if yes throw ForbiddenError
            const existingVillageConstructionInProgress = await Village_construction_progress.findOne({
                // include: [
                //     {
                //         model: Village_new_construction,
                //         where: {
                //             building_name: data.building_name
                //         }
                //     }
                // ],
                where: {
                    village_id: data.village_id
                }
            });
console.log("existingVillageConstructionInProgress step");
            if (existingVillageConstructionInProgress)
            {
                throw new ForbiddenError('Building construction already in progress');
            }

            // get the first level of the building and his construction cost
            const buildingFirstLevelAndCost = await Building_level.findOne({
                include: [
                    {
                        model: Building_cost
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
    
            // check if village has enough resources, if not throw ForbiddenError
            const villageResources = await Village_resource.findAll({
                where: {
                    village_id: data.village_id
                }
            });

            if (!villageResources.length)
            {
                throw new NotFoundError('Village resources not found');
            }

            const villageResourcesMap   = new Map();
            const buildingCostMap       = new Map();

            villageResources.forEach(villageResource => {
                villageResourcesMap.set(villageResource.resource_name, villageResource);
            });

            buildingFirstLevelAndCost.Building_costs.forEach(buildingCost => {
                buildingCostMap.set(buildingCost.resource_name, buildingCost);
            });

            for (const [resourceName, buildingCost] of buildingCostMap.entries())
            {
                const villageResource = villageResourcesMap.get(resourceName);
                if (!villageResource)
                {
                    throw new NotFoundError(`Village resource ${resourceName} not found`);
                }

                if (villageResource.quantity < buildingCost.quantity)
                {
                    throw new ForbiddenError(`Village does not have enough ${resourceName}`);
                }

                villageResource.quantity -= buildingCost.quantity;  
            }

            // generate the start date of the construction and the end date with the timestamp of the start date + the construction duration
            const startDate                             = new Date();
            const starDateInMilliseconds                = startDate.getTime();
            const constructionDurationInMilliseconds    = buildingFirstLevelAndCost.time * 1000;
            const endDate                               = new Date(starDateInMilliseconds + constructionDurationInMilliseconds);

            // update village resources
            const villageResourcesUpdatePromises = [];

            for (const villageResource of villageResourcesMap.values())
            {
                villageResourcesUpdatePromises.push(villageResource.save({ transaction }));
            }

            await Promise.all(villageResourcesUpdatePromises);
    
            // create a new village_constructoin_progresss with the start date and the end date
            const villageConstructionProgress = await Village_construction_progress.create({
                type: 'village_new_construction',
                construction_start: startDate,
                construction_end: endDate,
                village_id: data.village_id
            }, { transaction })

            if (!villageConstructionProgress)
            {
                throw new Error('Village production progress not created');
            }

            await transaction.commit();

            // create the associated village_new_construction
            const villageNewConstruction = await Village_new_construction.create({
                id: villageProductionProgress.id,
                building_name: data.building_name,
                building_level_id: buildingFirstLevelAndCost.id
            }, { transaction });

            console.log(villageNewConstruction);
            if (!villageNewConstruction)
            {
                // TODO: delete village_production_progresss and rollback resources
                throw new Error('Village new construction not created');
            }
    
            // set the village_new_building to the village_new_construction with setDataValue
            villageProductionProgress.setDataValue('village_new_construction', villageNewConstruction);
    
            // commit transaction
            // await transaction.commit();
    
            // return the village_update_construction
            return villageProductionProgress;
        }
        catch (error)
        {
            console.log("here", error);
            await transaction.rollback();
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
            throw new NotFoundError('Village nit not found')
        }

        return villageProductionProgress.destroy();
    }
}

module.exports = new VillageProductionProgressService();