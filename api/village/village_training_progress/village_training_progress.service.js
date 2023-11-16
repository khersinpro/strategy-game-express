const NotFoundError = require('../../../errors/not-found');
const BadRequestError = require('../../../errors/bad-request');
const ForbiddenError = require('../../../errors/forbidden');
const sequelize = require('../../../database/index').sequelize;
const VillageService = require('../village.service');
const { 
    Village_training_progress, 
    Unit, 
    Unit_cost,
    Village_building, 
    Village_unit,
    Village_resource,
    Village_construction_progress,
    Village_update_construction,
    Unit_production,
} = require('../../../database/index').models;

class VillageTrainingProgressService {
    /**
     * Return all village training progress into promise
     * @returns {Promise<Array<Village_training_progress>>}
     */
    getAll() {
        return Village_training_progress.findAll();
    }

    /**
     * Return a village training progress by id
     * @param id - Id of the village training progress
     * @return {VillageTrainingProgressService}
     */ 
    async getById(id) {
        try
        {
            const village_training_progress = Village_training_progress.findByPk(id);

            if (!village_training_progress)
            {
                throw new NotFoundError('Village training progress not found');
            }

            return village_training_progress;
        }
        catch (error)
        {
            throw error;
        }
    }

    /**
     * Create a new village training progress
     * @param {Object} data - Data of the village training progress to create
     * @param {Number} data.village_id - Id of the village
     * @param {String} data.unit_name - name of the unit
     * @param {Number} data.unit_to_train_count - number of unit to train
     * @param {User} currentUser - Current user
     * @returns {Promise<Sequelize.Transaction>} - Promise of the transaction to commit
     */
    async create(data, currentUser) {
        const transaction = await sequelize.transaction();
        try
        {
            // check if the village exists, if not throw NotFoundError
            const village = await VillageService.getById(data.village_id, { user: 1})
    
            // check if current user has the ownership of the village or if he is an admin, if not throw ForbiddenError
            village.isAdminOrVillageOwner(currentUser);

            // check if the unit exist and if the village has the building required to train the unit, if not throw BadRequestError
            const unitToTrain = await Unit.findOne({
                attributes: ['name', 'training_time', 'population_cost', 'military_building'],
                where: {
                    name: data.unit_name,
                    civilization_name: village.civilization_name
                },
            });

            if (!unitToTrain)
            {
                throw new BadRequestError('Unit name is invalid.');
            }

            const village_building = await Village_building.findOne({
                attributes: ['id', 'building_level_id', 'building_name'],
                where: {
                    village_id: village.id,
                    building_name: unitToTrain.military_building
                }
            });

            if (!village_building)
            {
                throw new BadRequestError('Village does not have the building required to train the unit.');
            }

            // check if the village_building is not under construction, if not throw BadRequestError
            const village_construction_progress = await Village_construction_progress.findAll({
                attributes: ['id'],
                include: [
                    {
                        model: Village_update_construction,
                        attributes: ['id'],
                        required: true,
                        where: {
                            village_building_id: village_building.id
                        }
                    }
                ],
                where: {
                    enabled: true,
                    archived: false,
                    type: 'village_update_construction'
                }
            });

            if (village_construction_progress && village_construction_progress.length > 0)
            {
                throw new BadRequestError('Village building is under construction.');
            }

            // Check if the village_building has no more than 3 village_training_progress, if not throw BadRequestError
            const VillageTrainingProgressCount = await Village_training_progress.count({
                attributes: ['id'],
                where: {
                    village_building_id: village_building.id,
                    enabled: true,
                    archived: false
                }
            });

            if (VillageTrainingProgressCount >= 3)
            {
                throw new BadRequestError('Village building has already 3 training progress.');
            }

            // check if the village has the village_unit table entry for the unit, if not create one
            const village_unit = await Village_unit.findOne({
                attributes: ['id'],
                where: {
                    village_id: village.id,
                    unit_name: unitToTrain.name
                }
            });

            if (!village_unit)
            {
                await Village_unit.create({
                    village_id: village.id,
                    unit_name: unitToTrain.name,
                    quantity: 0
                });
            }
            
            // check if the village has enough resources to train the unit and update the village_resource, if not throw BadRequestError
            const unitCosts = await Unit_cost.findAll({
                where: {
                    unit_name: unitToTrain.name
                }
            });

            const village_resources = await Village_resource.findAll({
                where: {
                    village_id: village.id
                }
            });

            await this.checkAndUpdateResourcesBeforeTraining(village_resources, unitCosts, data.unit_to_train_count, transaction);
            
            // check if the village has enough population to train the unit, if not throw BadRequestError
            const hasEnoughPopulation = await village.checkPopulationCapacity(unitToTrain.population_cost * data.unit_to_train_count);

            if (!hasEnoughPopulation)
            {
                throw new BadRequestError('Village does not have enough population to train the unit.');
            }

            let startTrainingDate = new Date();
            
            if (VillageTrainingProgressCount && VillageTrainingProgressCount > 0)
            {
                const village_training_progress = await Village_training_progress.findOne({
                    attributes: ['training_end'],
                    where: {
                        village_building_id: village_building.id,
                        enabled: true,
                        archived: false
                    },
                    order: [
                        ['training_end', 'DESC']
                    ]
                });

                startTrainingDate = village_training_progress.training_end;
            }

            // get the unit_production reduction percentage of the village with the village_building level
            const unit_production = await Unit_production.findOne({
                attributes: ['reduction_percent'],
                where: {
                    military_building_name: village_building.building_name,
                    building_level_id: village_building.building_level_id
                }
            });

            if (!unit_production || !unit_production.reduction_percent)
            {
                throw new BadRequestError('Unit_production reduction percent not found.');
            }

            const singleTrainingDuration            = unitToTrain.training_time * (1 - unit_production.reduction_percent / 100);
            const totalTrainingTimeInMilliseconds   = singleTrainingDuration * 1000 * data.unit_to_train_count;
            const endTrainingDate                   = new Date(startTrainingDate.getTime() + totalTrainingTimeInMilliseconds);
            
            // generate the time to create one unit with the reduction percent

            // create the village_training_progress entry
            await Village_training_progress.create({
                training_start: startTrainingDate,
                training_end: endTrainingDate,
                unit_to_train_count: data.unit_to_train_count,
                trained_unit_count: 0,
                village_id: village.id,
                single_training_duration: singleTrainingDuration,
                village_building_id: village_building.id,
                village_unit_id: village_unit.id
            }, { transaction });

            return transaction.commit();
        }
        catch (error)
        {
            await transaction.rollback();
            throw error;
        }
    }

    update(id, data) {
        return Village_training_progress.update(data, {
            where: {
                id: id
            }
        });
    }

    delete(id) {
        try 
        {
            const village_training_progress = this.getById(id);

            if (!village_training_progress)
            {
                throw new NotFoundError('Village training progress not found');
            }

            return village_training_progress.destroy();
        }
        catch (error)
        {
            throw error;
        }
    }

    /**
     * A PLACER DANS LE FUTUR SERVICE DE UNIT_COST
     * Check if the village has enough resources to create a new village_training_progress and update the resources with or without transaction
     * WARNING: if transaction is not passed, the function will save the resources
     * WARNING: if transaction is passed, the function will not commit the transaction
     * @param {Village_resource[]} villageResource array of village_resource
     * @param {Unit_cost[]} unitCost array of Unit_cost
     * @param {Number} unitQuantity number of unit to train
     * @param {Sequelize.Transaction} transaction sequelize transaction
     * @throws {NotFoundError} when resource not found
     * @throws {ForbiddenError} when user is not allowed to update or create a village_training_progress
     * @returns {Promise<Village_resource[]>}
     */
    async checkAndUpdateResourcesBeforeTraining (villageResources, buildingCosts, unitQuantity, transaction = null) {
        try 
        {
            const villageResourcesMap   = new Map();
            const unitCostMap       = new Map();

            villageResources.forEach(villageResource => {
                villageResourcesMap.set(villageResource.resource_name, villageResource);
            });
    
            buildingCosts.forEach(unitCost => {
                unitCostMap.set(unitCost.resource_name, unitCost);
            });
    
            for (const [resourceName, unitCost] of unitCostMap.entries())
            {
                const villageResource = villageResourcesMap.get(resourceName);
    
                if (!villageResource)
                {
                    throw new NotFoundError(`Village resource ${resourceName} not found`);
                }

                if (villageResource.quantity < unitCost.quantity * unitQuantity)
                {
                    throw new ForbiddenError(`Village does not have enough ${resourceName} to create the unit training procress.`);
                }
    
                villageResource.quantity -= unitCost.quantity * unitQuantity;  
            }
    
            // update village resources
            const villageResourcesUpdatePromises = [];
    
            for (const villageResource of villageResourcesMap.values())
            {
                villageResourcesUpdatePromises.push(villageResource.save(transaction ? { transaction } : {}));
            }
            
            return Promise.all(villageResourcesUpdatePromises);
        }
        catch (error)
        {
            throw error;
        }
    }  
}

module.exports = new VillageTrainingProgressService();