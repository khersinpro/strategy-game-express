const NotFoundError                 = require('../../../errors/not-found');
const Village_resource              = require('../../../database/models/village_resource');
const Village_construction_progress = require('../../../database/models/village_construction_progress');
const Village_building              = require('../../../database/models/village_building');
const { sequelize }                 = require('../../../database/index'); 

class VillageBuildingService {
    /**
     * Returns resources of all villages
     * @returns {Promise<Village_resource>}
     */
    getAll() {
        return Village_resource.findAll();
    }

    /**
     * Returns resource of a village
     * @param {Number} id village resource id 
     * @throws {NotFoundError} when village resource not found
     * @returns {Promise<Village_resource>}
     */ 
    async getById(id) {
        const villageResource = await Village_resource.findByPk(id);

        if (!villageResource)
        {
            throw new NotFoundError('Village resource not found')
        }

        return villageResource;
    }

    /**
     * Return created village resource promise
     * @param {Object} data village data
     * @returns {Promise<Village_resource>}
     */ 
    create(data) {
        return Village_resource.create(data);
    }

    /**
     * Return updated village resource promise
     * @param {Number} id village resource id
     * @param {Object} data village resource data
     * @param {sequelize.Transaction} transaction - transaction to use for update
     * @return {Promise<Village_resource>}
     */
    update(id, data, transaction) {
        const options = transaction ? { transaction } : {};

        return Village_resource.update(data, {
            where: {
                id: id
            },
            ...options
        });
    }

    /**
     * Return deleted village resource promise
     * @param {Number} id village resource id
     * @throws {NotFoundError} when village resource not found
     * @returns {Promise<Village_resource>}
     */ 
    async delete(id) {
        const villageResource = await this.getById(id);

        if (!villageResource)
        {
            throw new NotFoundError('Village resource not found')
        }

        return villageResource.destroy();
    }

    /**
     * Update all ressource of specific village
     * @param {Number} villageId - The id of the village
     * @param {Date} endDate - The end date of the update
     * @returns {Promise<Village_resource[]>}
     */ 
    async updateVillageResource (villageId, endDate = new Date()) {
        const transaction = await sequelize.transaction();
        try 
        {
            const villageResources = await sequelize.query('SELECT * FROM get_all_village_resources_by_village_id(:villageId)', {
                type: sequelize.QueryTypes.SELECT,
                replacements: { villageId },

            });

            const promises = []

            const lastVillageResourceUpdate = new Date(villageResources[0].village_last_update);

            // get all buildings updates since last village resource update
            const lastBuildingsUpdates = await sequelize.query('SELECT * FROM get_village_buildings_update_by_id(:villageId, :startDate, :endDate)', {
                replacements: { villageId, startDate: lastVillageResourceUpdate, endDate: endDate },
                type: sequelize.QueryTypes.SELECT
            });

            for (const villageResource of villageResources) 
            {
                const generatedPromise = this.calculateUniqueVillageResourceProduction(villageResource, lastBuildingsUpdates, endDate, transaction);

                if (generatedPromise) 
                {
                    promises.push(generatedPromise)
                }
            };
    
            await Promise.all(promises);

            return transaction.commit();
        }
        catch (error)
        {
            await transaction.rollback();
            throw error;
        }

    }

    /**
     * Update all villages resources
     * @returns {Promise<Village_resource[]>}
     */
    async updateAllVillagesResources() {
        const transaction = await sequelize.transaction();
        try 
        {
            const allVillagesResources = await sequelize.query('SELECT * FROM get_all_village_resources()');

            const promises = []
    
            // sort villages resources by allVillagesResources.village_id and make village resource array by village id
            const villagesResourcesByVillageId = allVillagesResources.reduce((acc, villageResource) => {
                if (!acc[villageResource.village_id]) {
                    acc[villageResource.village_id] = [];
                }
                acc[villageResource.village_id].push(villageResource);
                return acc;
            }, {});
    
            for (const villageId in villagesResourcesByVillageId) 
            {
                const villageResources = villagesResourcesByVillageId[villageId];
    
                if (!villageResources.length) continue;
    
                const lastVillageResourceUpdate = new Date(villageResources[0].village_last_update);
                const lastBuildingsUpdates = await sequelize.query('SELECT * FROM get_village_buildings_update_by_id(:villageId, :startDate, :endDate)', {
                    replacements: { villageId, startDate: lastVillageResourceUpdate, endDate: new Date() }
                });
    
                for (const villageResource of villageResources)
                {
                    const generatedPromise = this.calculateUniqueVillageResourceProduction(villageResource, lastBuildingsUpdates, transaction);
                    if (generatedPromise) 
                    {
                        promises.push(generatedPromise)
                    }
                }
                
            };
    
            await Promise.all(promises);

            return transaction.commit();
        }
        catch (error)
        {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Generate update resource promise if needed
     * @param {Object} villageResource  - Data of the village resource
     * @param {Object[]} lastBuildingsUpdates - Data of last resource_building and storage_building updated since last resource production update
     * @param {Date} updateDateLimit - limit date to update the village resource
     * @param {sequelize.Transaction} resourceTransaction - transaction to use for update
     * @returns {Promise<Village_resource> || false}
     */
    async calculateUniqueVillageResourceProduction (villageResource, lastBuildingsUpdates, updateDateLimit = new Date(), resourceTransaction = false) {
        try 
        {
            let lastResourceUpdate    = new Date(villageResource.village_last_update);
            let totalResource         = villageResource.village_resource_quantity;
            let storageCapacity       = villageResource.village_resource_storage;
            let buildingProduction    = villageResource.production;

            lastBuildingsUpdates.forEach(async (lastBuildingsUpdate) => {
                const options = resourceTransaction ? { transaction: resourceTransaction } : {};
                if (lastBuildingsUpdate.building_type === 'resource_building' && villageResource.production_village_building_id === lastBuildingsUpdate.village_building_id )
                {
                    // update village totalResource with generated production into lastResourceUpdate and lastBuildingsUpdate.construction_end
                    const constructionEnd       = new Date(lastBuildingsUpdate.construction_end);
                    const diffInMilisecond      = constructionEnd - lastResourceUpdate;
                    const diffInMinute          = Math.floor(diffInMilisecond / 1000 / 60);
                    const productionInMinute    = buildingProduction / 60;
                    const generatedProduction   = productionInMinute * diffInMinute;
                    const totalProduction       = totalResource + generatedProduction;
                    totalResource               = totalProduction > storageCapacity ? storageCapacity : totalProduction;
    
                    // update lastResourceUpdate with lastBuildingsUpdate.construction_end
                    lastResourceUpdate = constructionEnd;
    
                    // update villageResource.production with lastBuildingsUpdate.resource_production
                    buildingProduction = lastBuildingsUpdate.resource_production;
    
                    // create the village building update then update the villae_constructon_progress to enabled = false and archived = true
                    await Village_building.update({ building_level_id: lastBuildingsUpdate.building_level_id }, {
                            where : { id : lastBuildingsUpdate.village_building_id },
                            ...options 
                    });
    
                    await Village_construction_progress.update({ enabled: false, archived: true }, {
                        where : { id : lastBuildingsUpdate.construction_progress_id },
                        ...options
                    });
    
                }
                else if (lastBuildingsUpdate.building_type === 'storage_building' && villageResource.storage_village_building_id === lastBuildingsUpdate.village_building_id)
                {
                    // update village totalResource with generated production into lastResourceUpdate and lastBuildingsUpdate.construction_end
                    const constructionEnd       = new Date(lastBuildingsUpdate.construction_end);
                    const diffInMilisecond      = constructionEnd - lastResourceUpdate;
                    const diffInMinute          = Math.floor(diffInMilisecond / 1000 / 60);
                    const productionInMinute    = buildingProduction / 60;
                    const generatedProduction   = productionInMinute * diffInMinute;
                    const totalProduction       = totalResource + generatedProduction;
                    totalResource               = totalProduction > storageCapacity ? storageCapacity : totalProduction;
    
                    // update lastResourceUpdate with lastBuildingsUpdate.construction_end
                    lastResourceUpdate = constructionEnd;
    
                    // update villageResource.storage_capacity with lastBuildingsUpdate.storage_capacity
                    storageCapacity = lastBuildingsUpdate.storage_capacity;
    
                    // create the village building update then update the villae_constructon_progress to enabled = false and archived = true
                    await Village_building.update({ building_level_id: lastBuildingsUpdate.building_level_id }, {
                        where : { id : lastBuildingsUpdate.village_building_id },
                        ...options 
                    });
    
                    await Village_construction_progress.update({ enabled: false, archived: true }, {
                        where : { id : lastBuildingsUpdate.construction_progress_id },
                        ...options
                    });
                }
            });
            
            const diffInMilisecond      = updateDateLimit - lastResourceUpdate;
            const diffInMinute          = Math.floor(diffInMilisecond / 1000 / 60);
            const productionInMinute    = buildingProduction / 60;
            const generatedProduction   = productionInMinute * diffInMinute;
            totalResource               = totalResource + generatedProduction;
    
            if (generatedProduction <= 0) 
            {
                return false;
            }

            const updatedQuantity = totalResource > storageCapacity ? storageCapacity : totalResource;
            
            return this.update(villageResource.village_resource_id, 
                { 
                    quantity: updatedQuantity, 
                    updatedAt: updateDateLimit
                }, resourceTransaction
            );
        }
        catch (error)
        {
            throw error;
        }
    }
}

module.exports = new VillageBuildingService();