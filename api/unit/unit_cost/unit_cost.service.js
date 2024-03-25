const NotFoundError             = require('../../../errors/not-found');
const ForbiddenError            = require('../../../errors/forbidden');
const BadRequestError           = require('../../../errors/bad-request');
const sequelize                 = require('../../../database/index').sequelize;
const VillageResourceService    = require('../../village/village_resource/village_resource.service');
const Unit_cost                 = require('../../../database/models/unit_cost');
const Village_resource          = require('../../../database/models/village_resource');

class UnitCostService {
    /**
     * return all unit costs into promise
     * @returns {Promise<Unit_cost[]>}
     */
    getAll() {
        return Unit_cost.findAll();
    }

    /**
     * return a unit cost by id into promise
     * @param {Number} id
     * @throws {NotFoundError} When the unit cost is not found
     * @returns {Promise<Unit_cost>}
     */
    async getById(id) {
       const unitCost = await Unit_cost.findByPk(id);
       
        if (!unitCost) {
            throw new NotFoundError('Unit_cost not found');
        }

        return unitCost;
    }

    /**
     * Create a unit cost
     * @param {Object} data
     * @returns {Promise<Unit_cost>}
     */
    create(data) {
        return Unit_cost.create(data);
    }

    /**
     * Update a unit cost
     * @param {Number} id
     * @param {Object} data
     * @returns {Promise<Unit_cost>}
     */
    update(id, data) {
        return Unit_cost.update(data, {
            where: {
                id
            }
        });
    }

    /**
     * Delete a unit cost
     * @param {Number} id
     * @throws {NotFoundError} When the unit cost is not found
     * @returns {Promise<Unit_cost>}
     */
    async delete(id) {
        const unitCost = await this.getById(id);

        if (!unitCost) {
            throw new NotFoundError('Unit_cost not found');
        }

        return unitCost.destroy();
    }

    /**
     * Check if the village has enough resources to create a new village_training_progress and update the resources with transaction
     * @param {Number} villageId - Id of the village
     * @param {String} unitName - Name of the unit to train
     * @param {Number} unitQuantity - Quantity of unit to train
     * @param {Sequelize.Transaction} transaction - Sequelize transaction
     * @throws {NotFoundError} - When Village_resource or Unit_cost is not found
     * @throws {ForbiddenError} - When user has not enough resources to create the village_training_progress
     * @throws {BadRequestError} - When villageId, unitName or unitQuantity is not valid
     * @returns {Promise<Village_resource[]>}
     */
    async checkAndUpdateResourcesBeforeTraining (villageId, unitName, unitQuantity, transaction) {
        try 
        {
            if (!villageId || isNaN(villageId))
            {
                throw new BadRequestError('villageId must be a number.');
            }
            else if (!unitName || typeof unitName !== 'string')
            {
                throw new BadRequestError('unitName must be a string.');
            }
            else if (!unitQuantity || isNaN(unitQuantity))
            {
                throw new BadRequestError('unitQuantity must be a number.');
            }

            // Update the village resources
            await VillageResourceService.updateVillageResource(villageId);

            const villageResources = await Village_resource.findAll({
                where: {
                    village_id: villageId
                }
            });

            if (!villageResources || villageResources.length === 0)
            {
                throw new NotFoundError(`Village resource for this village id :${villageId} not found`);
            }

            const unitCosts = await Unit_cost.findAll({
                where: {
                    unit_name: unitName
                }
            });

            if (!unitCosts || unitCosts.length === 0)
            {
                throw new NotFoundError(`Unit cost for this unit name :${unitName} not found`);
            }

            const villageResourcesMap   = new Map();
            const unitCostMap           = new Map();

            villageResources.forEach(villageResource => {
                villageResourcesMap.set(villageResource.resource_name, villageResource);
            });

            unitCosts.forEach(unitCost => {
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
                villageResourcesUpdatePromises.push(villageResource.save({ transaction }));
            }
            
            return Promise.all(villageResourcesUpdatePromises);
        }
        catch (error)
        {
            throw error;
        }
    }  

    /**
     * Refund the resources after canceling the unit training progress
     * @param {Number} villageId - Id of the village
     * @param {String} unitName - Name of the unit to train
     * @param {Number} remainingUnitToTrain - Remaining unit to train
     * @param {Sequelize.Transaction} transaction - Sequelize transaction
     * @throws {NotFoundError} - When Village_resource or Unit_cost is not found
     * @throws {BadRequestError} - When villageId, unitName or remainingUnitToTrain is not valid
     * @returns {Promise<Village_resource[]>}
     */
    async refundResourcesAfterCancel (villageId, unitName, remainingUnitToTrain, transaction) {
        try
        {
            if (!villageId || isNaN(villageId))
            {
                throw new BadRequestError('villageId must be a number.');
            }
            else if (!unitName || typeof unitName !== 'string')
            {
                throw new BadRequestError('unitName must be a string.');
            }
            else if (!remainingUnitToTrain || isNaN(remainingUnitToTrain))
            {
                throw new BadRequestError('remainingUnitToTrain must be a number.');
            }

            // Get the unit cost
            const unitCosts = await Unit_cost.findAll({
                where: {
                    unit_name: unitName
                }
            });

            if (!unitCosts || unitCosts.length === 0)
            {
                throw new NotFoundError(`Unit cost for this unit name :${unitName} not found`);
            }

            // Update the village resources
            await VillageResourceService.updateVillageResource(villageId);
            
            // Get the village resources
            const villageResources = await sequelize.query('SELECT * FROM get_all_village_resources_by_village_id(:villageId)', { 
                replacements: { villageId: villageId }
            });

            if (!villageResources || villageResources.length === 0)
            {
                throw new NotFoundError(`Village resource for this village id :${villageId} not found`);
            }

            // Calculate the cost * remaining unit to train as resources to refund
            const promises = [];

            for (const unitCost of unitCosts)
            {
                const villageResource = villageResources.find(villageResource => villageResource.resource_name === unitCost.resource_name);

                if (!villageResource)
                {
                    throw new NotFoundError(`Village resource ${unitCost.resource_name} not found`);
                }

                const quantityToRefund      = unitCost.quantity * remainingUnitToTrain;
                const actualQuantity        = villageResource.village_resource_quantity;
                const maxQuantity           = villageResource.village_resource_storage;
                const isStorageFull         = actualQuantity + quantityToRefund > maxQuantity;
                const quantityAfterRefund   = isStorageFull ? maxQuantity : actualQuantity + quantityToRefund;
                
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
            return Promise.all(promises);
        }
        catch (error)
        {
            throw error;
        }
    }
}

module.exports = new UnitCostService();