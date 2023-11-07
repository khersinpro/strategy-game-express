const NotFoundError = require('../../../errors/not-found');
const { Village_resource, Village_construction_progress, Village_update_construction, Village_building, Building } = require('../../../database/index').models;
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

        console.log(allVillagesResources);

        // Voir comment calculer pour faire en sorte que ca calcule les 4 resource d'un coup pour chaque village
        for (const villageResource of allVillagesResources) 
        {
            const generatedPromise = this.calculateUniqueVillageResourceProduction(villageResource);
            if (generatedPromise) 
            {
                promises.push(generatedPromise)
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
        const lastResourceUpdate    = new Date(villageResource.village_last_update);
        const actualDate            = new Date();
        const diffInMilisecond      = actualDate - lastResourceUpdate;
        const diffInMinute          = Math.floor(diffInMilisecond / 1000 / 60);
        const productionInMinute    = villageResource.production / 60;
        const generatedProduction   = productionInMinute * diffInMinute;
        const storageCapacity       = villageResource.village_resource_storage;
        const totalResource         = villageResource.village_resource_quantity + generatedProduction;

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
                            include: [
                                {
                                    model: Building,
                                    where: {
                                        type: {
                                            [Op.in]: ['resource_building', 'storage_building']
                                        }
                                    },
                                    required: true,
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
                construction_end: {
                    [Op.between]: [recoveryDate, new Date()]
                }
            }
        })
    }

}

module.exports = new VillageBuildingService();