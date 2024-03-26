const NotFoundError             = require('../../../errors/not-found');
const ForbiddenError            = require('../../../errors/forbidden');
const sequelize                 =  require('../../../database/index').sequelize;
const VillageResourceService    = require('../../village/village_resource/village_resource.service');
const Building_cost             = require('../../../database/models/building_cost');
const Village_resource          = require('../../../database/models/village_resource');

class BuildingCostService {
    /**
     * return all building costs into promise
     * @returns {Promise<Building_cost[]>}
     */
    getAll() {
        return Building_cost.findAll();
    }

    /**
     * return a building cost by id into promise
     * @param {Number} id
     * @throws {NotFoundError} When the building cost is not found
     * @returns {Promise<Building_cost>}
     */
    async getById(id) {
       const buildingCost = await Building_cost.findByPk(id);
       
        if (!buildingCost) {
            throw new NotFoundError('Building_cost not found');
        }

        return buildingCost;
    }

    /**
     * Create a building cost
     * @param {Object} data
     * @returns {Promise<Building_cost>}
     */
    create(data) {
        return Building_cost.create(data);
    }

    /**
     * Update a building cost
     * @param {Number} id
     * @param {Object} data
     * @returns {Promise<Building_cost>}
     */
    update(id, data) {
        return Building_cost.update(data, {
            where: {
                id
            }
        });
    }

    /**
     * Delete a building cost
     * @param {Number} id
     * @throws {NotFoundError} When the building cost is not found
     * @returns {Promise<Building_cost>}
     */
    async delete(id) {
        const buildingCost = await this.getById(id);

        if (!buildingCost) {
            throw new NotFoundError('Building_cost not found');
        }

        return buildingCost.destroy();
    }


    /**
     * Check if the village has enough resources to create or update a building and update the resources
     * @param {Number} villageId - Id of the village
     * @param {buildingLevelId} buildingLevelId - Id of the building level related to the building cost
     * @param {Sequelize.Transaction} transaction - Sequelize transaction
     * @throws {NotFoundError} - When village resources or building costs are not found
     * @throws {ForbiddenError} - When village does not have enough resources
     * @returns {Promise<Village_resource[]>}
     */
    async checkAndUpdateResourcesBeforeCreate (villageId, buildingLevelId, transaction) {
        try 
        {
            if (!villageId || isNaN(villageId))
            {
                throw new Error('Village id is required');
            }
            else if (!buildingLevelId || isNaN(buildingLevelId))
            {
                throw new Error('Building level id is required');
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
                throw new NotFoundError(`Village resources with village id : ${villageId} not found`);
            }

            const buildingCosts = await Building_cost.findAll({
                where: {
                    building_level_id: buildingLevelId
                }
            });

            if (!buildingCosts || buildingCosts.length === 0)
            {
                throw new NotFoundError(`Building costs with building level id : ${buildingLevelId} not found`);
            }

            const villageResourcesMap   = new Map();
            const buildingCostMap       = new Map();

            villageResources.forEach(villageResource => {
                villageResourcesMap.set(villageResource.resource_name, villageResource);
            });
    
            buildingCosts.forEach(buildingCost => {
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
                    throw new ForbiddenError(`Village does not have enough ${resourceName} to create the building`);
                }
    
                villageResource.quantity -= buildingCost.quantity;  
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
     * Refund the resources after stop a building_construction_progress
     * @param {Number} villageId - Village id to refund
     * @param {Number} buildingLevelId - Building level id to get the building costs to refund
     * @param {Sequelize.Transaction} transaction - Sequelize transaction
     * @throws {NotFoundError} - When village resources or building costs are not found
     * @throws {ForbiddenError} - When village does not have enough resources
     * @returns {Promise<void>}
     */ 
    async refundResourcesAfterCancel (villageId, buildingLevelId, transaction) {
        try
        {
            if (!villageId || isNaN(villageId)) 
            {
                throw new Error('Village id is required');
            }

            // Update the village resources
            await VillageResourceService.updateVillageResource(villageId);

            const villageResources = await sequelize.query('SELECT * FROM get_all_village_resources_by_village_id(:villageId)', { 
                replacements: { villageId },
                type: sequelize.QueryTypes.SELECT,
            });

            if (!villageResources || villageResources.length === 0)
            {
                throw new NotFoundError(`Village resources with village id : ${villageId} not found`);
            }

            const buildingCosts = await Building_cost.findAll({
                where: {
                    building_level_id: buildingLevelId
                }
            });

            if (!buildingCosts || buildingCosts.length === 0)
            {
                throw new NotFoundError(`Building costs with building level id : ${buildingLevelId} not found`);
            }

            const promises = [];

            for (const buildingCost of buildingCosts)
            {
                const villageResource = villageResources.find(villageResource => villageResource.resource_name === buildingCost.resource_name);

                if (!villageResource)
                {
                    throw new NotFoundError(`Village resource ${buildingCost.resource_name} not found`);
                }

                const quantityToRefund = buildingCost.quantity;
                const actualQuantity = villageResource.village_resource_quantity;
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

            await Promise.all(promises);
        }
        catch (error)
        {
            throw error;
        }
    }
}

module.exports = new BuildingCostService();