const NotFoundError                 = require('../../../errors/not-found');
const BadRequestError               = require('../../../errors/bad-request');
const sequelize                     = require('../../../database/index').sequelize;
const VillageService                = require('../village.service');
const VillageUnitService            = require('../village_unit/village_unit.service');
const UnitCostService               = require('../../unit/unit_cost/unit_cost.service');
const Village_training_progress     = require('../../../database/models/village_training_progress');
const Unit                          = require('../../../database/models/unit');
const Village_building              = require('../../../database/models/village_building');
const Village_unit                  = require('../../../database/models/village_unit');
const Village_construction_progress = require('../../../database/models/village_construction_progress');
const Village_update_construction   = require('../../../database/models/village_update_construction');
const Unit_production               = require('../../../database/models/unit_production');

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
     * @returns {Promise<Village_training_progress>}
     */
    async create(data, currentUser) {
        const transaction = await sequelize.transaction();
        try
        {
            // check if the village exists, if not throw NotFoundError
            const village = await VillageService.getById(data.village_id, { user: 1})
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
            
            console.log('je suis ici', villageUnit);
            if (!villageUnit)
            {
                await Village_unit.create({
                    village_id: village.id,
                    unit_name: unitToTrain.name,
                    total_quantity: 0
                });
            }

            // check if the village has enough population to train the unit, if not throw BadRequestError
            const hasEnoughPopulation = await village.checkPopulationCapacity(unitToTrain.population_cost * data.unit_to_train_count);

            if (!hasEnoughPopulation)
            {
                throw new BadRequestError('Village does not have enough population to train the unit.');
            }
            
            // check if the village has enough resources to train the unit and update the village_resource, if not throw BadRequestError
            await UnitCostService.checkAndUpdateResourcesBeforeTraining(village.id, unitToTrain.name, data.unit_to_train_count, transaction);
            
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
            const villageTrainingProgress = await Village_training_progress.create({
                training_start: startTrainingDate,
                training_end: endTrainingDate,
                unit_to_train_count: data.unit_to_train_count,
                trained_unit_count: 0,
                village_id: village.id,
                single_training_duration: singleTrainingDuration,
                village_building_id: villageBuilding.id,
                village_unit_id: villageUnit.id
            }, { transaction });

            await transaction.commit();
            return villageTrainingProgress;
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

    async cancelTrainingProgress (id, currentUser) {
        const transaction = await sequelize.transaction();  
        try
        {
            // check if the village training progress 
            const trainingProgressToCancel = await Village_training_progress.findByPk(id, {
                include: [
                    {
                        attributes: ['id', 'unit_name'],
                        model: Village_unit,
                        required: true,
                    }
                ]
            });

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

            // Update the village_unit quantity before cancelling the training progress
            await VillageUnitService.addUnitAfterTraining(village.id);

            // get the count of remaining unit to train
            const remainingUnitToTrain = trainingProgressToCancel.unit_to_train_count - trainingProgressToCancel.trained_unit_count;
            
            // get the cost of single unit
            await UnitCostService.refundResourcesAfterCancel(village.id, trainingProgressToCancel.Village_unit.unit_name, remainingUnitToTrain, transaction);

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