const NotFoundError = require('../../../errors/not-found');
const { Village_resource, Village_construction_progress, Village_update_construction, Village_building, Building_level, Storage_capacity, Resource_production } = require('../../../database/index').models;
const { sequelize }  = require('../../../database/index'); 
const { Op } = require('sequelize');

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
     * @return {Promise<Village_resource>}
     */
    update(id, data) {
        return Village_resource.update(data, {
            where: {
                id: id
            }
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
     * @param {Number} villageId
     * @returns {Promise<Village_resource[]>}
     */ 
    async updateVillageResource (villageId) {
        const villageResources = await sequelize.query('CALL get_all_village_resources_by_village_id(:villageId)', {
            replacements: { villageId }
        });

        console.log(villageResources);
        const promises = []

        
        
        for (const villageResource of villageResources) 
        {
            const lastBuildingsUpdates = await this.getLastVillageResourcesAndStorageBuildingsUpdated(villageId, new Date(villageResource.village_last_update));
            const generatedPromise = this.calculateUniqueVillageResourceProduction(villageResource);
            if (generatedPromise) 
            {
                promises.push(generatedPromise)
            }
        };


        return Promise.all(promises);
    }

    /**
     * Update all villages resources
     * @returns {Promise<Village_resource[]>}
     */
    async updateAllVillagesResources() {
        const allVillagesResources = await sequelize.query('CALL get_all_village_resources()');

        const promises = []

        // sort villages resources by allVillagesResources.village_id and make village resource array by village id
        const villagesResourcesByVillageId = allVillagesResources.reduce((acc, villageResource) => {
            if (!acc[villageResource.village_id]) {
                acc[villageResource.village_id] = [];
            }
            acc[villageResource.village_id].push(villageResource);
            return acc;
        }, {});

        // Voir comment calculer pour faire en sorte que ca calcule les 4 resource d'un coup pour chaque village
        for (const villageId in villagesResourcesByVillageId) 
        {
            const villageResources = villagesResourcesByVillageId[villageId];

            if (!villageResources.length) continue;

            const lastVillageResourceUpdate = new Date(villageResources[0].village_last_update);
            const lastBuildingsUpdates = await this.getLastVillageResourcesAndStorageBuildingsUpdated(villageId, lastVillageResourceUpdate);
            if (lastBuildingsUpdates.length)
            {
                console.log('abcd',lastBuildingsUpdates[0]);
                console.log('Village_update_construction',lastBuildingsUpdates[0].Village_update_construction);
                console.log('Building_level',lastBuildingsUpdates[0].Village_update_construction.Village_building.Building_level);
                console.log('abcd',lastBuildingsUpdates[0].Village_update_construction.Village_building.Building_level.Resource_productions);
                console.log('abcd',lastBuildingsUpdates[0].Village_update_construction.Village_building.Building_level.Storage_capacities);
                throw new Error(lastBuildingsUpdates);
            }
            for (const villageResource of villageResources)
            {
                const generatedPromise = this.calculateUniqueVillageResourceProduction(villageResource, lastBuildingsUpdates);
                if (generatedPromise) 
                {
                    promises.push(generatedPromise)
                }
            }
            
        };

        return Promise.all(promises);
    }

    /**
     * Generate update resource promise if needed
     * @param {Object} villageResource  
     * @param {Object[]} lastBuildingsUpdates - data of last resource_building and storage_building updated since last resource production update
     * @returns {Promise<Village_resource> || false}
     */
    async calculateUniqueVillageResourceProduction (villageResource, lastBuildingsUpdates) {
        let lastResourceUpdate    = new Date(villageResource.village_last_update);
        let totalResource         = villageResource.village_resource_quantity;
        let storageCapacity       = villageResource.village_resource_storage;
        let buildingProduction    = villageResource.production;

        lastBuildingsUpdates.forEach(async (lastBuildingsUpdate) => {
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
            }
        });
        
        
        const actualDate            = new Date();
        const diffInMilisecond      = actualDate - lastResourceUpdate;
        const diffInMinute          = Math.floor(diffInMilisecond / 1000 / 60);
        const productionInMinute    = buildingProduction / 60;
        const generatedProduction   = productionInMinute * diffInMinute;
        
        

        if (totalResource <= 0 && generatedProduction <= 0) 
        {
            return false;
        }

        const updatedQuantity = totalResource > storageCapacity ? storageCapacity : totalResource;
        return this.update(villageResource.village_resource_id, { quantity: updatedQuantity });
    }

    /**
     * Get last village resources and storage buildings updated into last resource production update
     * @param {Number} villageId - village id
     * @param {Date} recoveryDate - max date to recover building update
     * @returns {Promise<Village_construction_progress[]>}
     */
    async getLastVillageResourcesAndStorageBuildingsUpdated(villageId, recoveryDate) {
        // En faire une requête SQL
        return Village_construction_progress.findAll({
            include: [
                {
                    model: Village_update_construction,
                    required: true,
                    include: [
                        {
                            model: Village_building,
                            required: true,
                            where: {
                                type: {
                                    [Op.in]: ['resource_building', 'storage_building']
                                }
                            },
                            include: [
                                {
                                    model: Building_level,
                                    required: true,
                                    include: [
                                        {
                                            model: Storage_capacity,
                                        },
                                        {
                                            model: Resource_production,
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {
                village_id: villageId,
                enabled: false,
                archived: true,
                type: 'village_update_construction',
                construction_end: {
                    [Op.between]: [recoveryDate, new Date()]
                }
            },
            order: [['construction_end', 'DESC']]
        })
    }

}

module.exports = new VillageBuildingService();