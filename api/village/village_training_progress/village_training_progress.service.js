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
     * @return {Promise<VillageTrainingProgressService>}
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

            const villageBuilding = await Village_building.findOne({
                attributes: ['id', 'building_level_id', 'building_name'],
                where: {
                    village_id: village.id,
                    building_name: unitToTrain.military_building
                }
            });

            if (!villageBuilding)
            {
                throw new BadRequestError('Village does not have the building required to train the unit.');
            }

            // check if the village_building is not under construction, if not throw BadRequestError
            const villageConstructionProgress = await Village_construction_progress.findAll({
                attributes: ['id'],
                include: [
                    {
                        model: Village_update_construction,
                        attributes: ['id'],
                        required: true,
                        where: {
                            village_building_id: villageBuilding.id
                        }
                    }
                ],
                where: {
                    enabled: true,
                    archived: false,
                    type: 'village_update_construction'
                }
            });

            if (villageConstructionProgress && villageConstructionProgress.length > 0)
            {
                throw new BadRequestError('Village building is under construction.');
            }
            
            // Check if the village_building has no more than 3 village_training_progress, if not throw BadRequestError
            const VillageTrainingProgressCount = await Village_training_progress.count({
                where: {
                    village_building_id: villageBuilding.id,
                    enabled: true,
                    archived: false
                }
            });
            
            if (VillageTrainingProgressCount >= 3)
            {
                throw new BadRequestError('Village building has already 3 training progress.');
            }

            // check if the village has the village_unit table entry for the unit, if not create one
            const villageUnit = await Village_unit.findOne({
                attributes: ['id'],
                where: {
                    village_id: village.id,
                    unit_name: unitToTrain.name
                }
            });

            if (!villageUnit)
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

            const villageResources = await Village_resource.findAll({
                where: {
                    village_id: village.id
                }
            });

            await this.checkAndUpdateResourcesBeforeTraining(villageResources, unitCosts, data.unit_to_train_count, transaction);
            
            // check if the village has enough population to train the unit, if not throw BadRequestError
            const hasEnoughPopulation = await village.checkPopulationCapacity(unitToTrain.population_cost * data.unit_to_train_count);

            if (!hasEnoughPopulation)
            {
                throw new BadRequestError('Village does not have enough population to train the unit.');
            }

            let startTrainingDate = new Date();
            
            if (VillageTrainingProgressCount && VillageTrainingProgressCount > 0)
            {
                const villageTrainingProgress = await Village_training_progress.findOne({
                    attributes: ['training_end'],
                    where: {
                        village_building_id: villageBuilding.id,
                        enabled: true,
                        archived: false
                    },
                    order: [
                        ['training_end', 'DESC']
                    ]
                });

                startTrainingDate = villageTrainingProgress.training_end;
            }

            // get the unit_production reduction percentage of the village with the village_building level
            const unitProduction = await Unit_production.findOne({
                attributes: ['reduction_percent'],
                where: {
                    military_building_name: villageBuilding.building_name,
                    building_level_id: villageBuilding.building_level_id
                }
            });

            if (!unitProduction || !unitProduction.reduction_percent)
            {
                throw new BadRequestError('Unit_production reduction percent not found.');
            }

            const singleTrainingDuration            = unitToTrain.training_time * (1 - unitProduction.reduction_percent / 100);
            const totalTrainingTimeInMilliseconds   = singleTrainingDuration * 1000 * data.unit_to_train_count;
            const endTrainingDate                   = new Date(startTrainingDate.getTime() + totalTrainingTimeInMilliseconds);
            
            // create the village_training_progress entry
            await Village_training_progress.create({
                training_start: startTrainingDate,
                training_end: endTrainingDate,
                unit_to_train_count: data.unit_to_train_count,
                trained_unit_count: 0,
                village_id: village.id,
                single_training_duration: singleTrainingDuration,
                village_building_id: villageBuilding.id,
                village_unit_id: villageUnit.id
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

    async cancelTrainingProgress (id, currentUser) {
        const transaction = await sequelize.transaction();  
        try
        {
            // make an update of training progress , create the function in the appropriate service

            // check if the village training progress 
            const trainingProgressToCancel = await this.getById(id);

            if (!trainingProgressToCancel)
            {
                throw new NotFoundError('Village training progress not found');
            }

            // check if training progress is enabled and not archived
            if (!trainingProgressToCancel.enabled || trainingProgressToCancel.archived)
            {
                throw new BadRequestError('Village training progress is already cancelled');
            }

            // check if the village exists, if not throw NotFoundError
            const village = await VillageService.getById(trainingProgressToCancel.village_id)

            // check if current user has the ownership of the village or if he is an admin, if not throw ForbiddenError
            village.isAdminOrVillageOwner(currentUser);

            // get the count of remaining unit to train
            const remainingUnitToTrain = trainingProgressToCancel.unit_to_train_count - trainingProgressToCancel.trained_unit_count;
            
            // get the cost of single unit
            const unitCosts = await Unit_cost.findAll({
                where: {
                    unit_name: trainingProgressToCancel.unit_name
                }
            });

            // get the village resources
            const villageResources = await sequelize.query('CALL get_all_village_resources_by_village_id(:villageId)', { 
                replacements: { villageId: village.id },
                type: sequelize.QueryTypes.SELECT 
            });

            // calculate the cost * remaining unit to train as resources to refund
            const promises = [];

            for (const unitCost of unitCosts)
            {
                const villageResource = villageResources.find(villageResource => villageResource.resource_name === unitCost.resource_name);

                if (!villageResource)
                {
                    throw new NotFoundError(`Village resource ${unitCost.resource_name} not found`);
                }

                const quantityToRefund = unitCost.quantity * remainingUnitToTrain;
                const actualQuantity = villageResource.quantity;
                const maxQuantity = villageResource.village_resource_storage;
                const quantityAfterRefund = actualQuantity + quantityToRefund > maxQuantity ? maxQuantity : actualQuantity + quantityToRefund;
                const promise = Village_resource.update({
                    quantity: quantityAfterRefund
                }, {
                    where: {
                        id: villageResource.village_resource_id
                    },
                    transaction
                });
                promises.push(promise);
            }

            // update the village resource with the resources to refund
            await Promise.all(promises);

            // update the village training progress to disabled and archived
            await Village_training_progress.update({
                enabled: false,
                archived: true
            }, {
                where: {
                    id: trainingProgressToCancel.id
                },
                transaction
            });

            return transaction.commit();
        }
        catch (error)
        {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new VillageTrainingProgressService();