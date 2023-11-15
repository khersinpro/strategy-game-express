const NotFoundError = require('../../../errors/not-found');
const ForbiddenError = require('../../../errors/forbidden');
const { Building_cost, Village_resource } = require('../../../database').models;

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
     * Check if the village has enough resources to create or update a building and update the resources with or without transaction
     * WARNING: if transaction is not passed, the function will save the resources
     * WARNING: if transaction is passed, the function will not commit the transaction
     * @param {Village_resource} villageResource array of village_resource
     * @param {Building_cost[]} buildingCost array of building_cost
     * @param {Sequelize.Transaction} transaction sequelize transaction
     * @throws {NotFoundError} when resource not found
     * @throws {ForbiddenError} when user user is not allowed to update or create a building
     * @returns {Promise<Village_resource[]>}
     */
    async checkAndUpdateResourcesBeforeCreate (villageResources, buildingCosts, transaction = null) {
        try 
        {
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

module.exports = new BuildingCostService();