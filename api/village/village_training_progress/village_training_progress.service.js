const NotFoundError = require('../../../errors/not-found');
const BadRequestError = require('../../../errors/bad-request');
const sequelize = require('../../../database/index').sequelize;
const VillageService = require('../village.service');
const { 
    Village_training_progress, 
    Unit, 
    Unit_type, 
    Unit_cost,
    Village_building, 
    Village_unit,
    Village_resource,
    Military_building, 
    Building_level,
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
     * @returns {VillageTrainingProgressService}
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
     * 
     * @param {Object} data - Data of the village training progress to create
     * @param {Number} data.village_id - Id of the village
     * @param {String} data.unit_name - name of the unit
     * @param {Number} data.unit_to_train - number of unit to train
     * @param {User} currentUser - Current user
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
            const village_construction_progress = await village_building.getVillage_construction_progress({
                where: {
                    enabled: true,
                    archived: false
                }
            });

            if (village_construction_progress)
            {
                throw new BadRequestError('Village building is under construction.');
            }

            // check if the village has the village_unit table entry for the unit, if not create one
            const village_unit = await Village_unit.findOne({
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

            await this.checkAndUpdateResourcesBeforeTraining(village_resources, unitCosts, data.unit_to_train, transaction);

            // check if the village has enough population to train the unit, if not throw BadRequestError
            

            // create the village_training_progress entry

            // update the village resources



        }
        catch (error)
        {
            await transaction.rollback();
            throw error;
        }
    }

    update(id, data) {

    }

    delete(id) {

    }

    /**
     * A PLACER DANS LE FUTUR SERVICE DE UNIT_COST
     * Check if the village has enough resources to create a new village_training_progress and update the resources with or without transaction
     * WARNING: if transaction is not passed, the function will save the resources
     * WARNING: if transaction is passed, the function will not commit the transaction
     * @param {Village_resource} villageResource array of village_resource
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