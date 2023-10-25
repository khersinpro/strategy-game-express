const NotFoundError = require('../../../errors/not-found');
const { Village_resource } = require('../../../database/index').models;
const { sequelize }  = require('../../../database/index'); 
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

    async updateVillageResource (villageId) {
        const query = "\
        SELECT village_building.building_name, \
        resource_production.production, \
        resource_building.resource_name, \
        village_resource.id AS village_resource_id, \
        village_resource.quantity AS village_resource_quantity, \
        village_resource.updatedAt AS village_last_update,\
        (   SELECT storage_capacity.capacity FROM village_building \
            LEFT JOIN building ON village_building.building_name = building.name\
            LEFT JOIN storage_building ON building.name = storage_building.name\
            LEFT JOIN storage_capacity ON village_building.building_level_id = storage_capacity.building_level_id\
            WHERE village_building.village_id = :villageId\
            AND building.type = 'storage_building'\
            AND storage_building.resource_name = resource_building.resource_name\
        ) AS village_resource_storage\
        FROM `village_building` \
        LEFT JOIN building ON village_building.building_name = building.name \
        LEFT JOIN resource_building ON building.name = resource_building.name\
        LEFT JOIN resource_production ON village_building.building_level_id = resource_production.building_level_id\
        LEFT JOIN village_resource ON resource_building.resource_name = village_resource.resource_name\
        WHERE building.type = 'resource_building'\
        AND village_building.village_id = :villageId\
        AND village_resource.village_id =:villageId;\
        "

        const [villageResources, metadata] = await sequelize.query(query, {
            replacements: { villageId }
        });

        const promises = []

        for (const villageResource of villageResources) {
            const lastResourceUpdate = new Date(villageResource.village_last_update);
            const actualDate = new Date();
            const diffInMilisecond = actualDate - lastResourceUpdate;
            const diffInMinute = Math.floor(diffInMilisecond / 1000 / 60);
            const productionInMinute = villageResource.production / 60;
            const generatedtProduction = productionInMinute * diffInMinute
            let totalResource = villageResource.village_resource_quantity + generatedtProduction;

            if (totalResource > villageResource.village_resource_storage) {
                totalResource = villageResource.village_resource_storage;
            }

            if (totalResource > 0) {
                promises.push(this.update(villageResource.village_resource_id, { quantity: totalResource }))
            }
        };

        if (promises.length === 0) 
        {
            await Promise.all(promises);
        }

        return villageResources;
    }

    async updateAllVillagesResources() {
        const query = "\
            SELECT v1.building_name,\
            resource_production.production, \
            v1.village_id,\
            resource_building.resource_name, \
            village_resource.id AS village_resource_id, \
            village_resource.quantity AS village_resource_quantity, \
            village_resource.updatedAt AS village_last_update,\
            (   SELECT storage_capacity.capacity FROM village_building \
                LEFT JOIN building ON village_building.building_name = building.name\
                LEFT JOIN storage_building ON building.name = storage_building.name\
                LEFT JOIN storage_capacity ON village_building.building_level_id = storage_capacity.building_level_id\
                WHERE v1.village_id = village_building.village_id\
                AND building.type = 'storage_building'\
                AND storage_building.resource_name = resource_building.resource_name\
            ) AS village_resource_storage\
            FROM `village_building` v1\
            LEFT JOIN building ON v1.building_name = building.name \
            LEFT JOIN resource_building ON building.name = resource_building.name\
            LEFT JOIN resource_production ON v1.building_level_id = resource_production.building_level_id\
            LEFT JOIN village_resource ON resource_building.resource_name = village_resource.resource_name\
            WHERE building.type = 'resource_building'\
            AND v1.village_id = village_resource.village_id  \
            ORDER BY `village_resource_id` ASC;\
        ";

        const [allVillagesResources, metadata] = await sequelize.query(query);
    }
}

module.exports = new VillageBuildingService();