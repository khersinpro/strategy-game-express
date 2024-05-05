const { sequelize } = require('../../../database');
const NotFoundError = require('../../../errors/not-found');
const Building_level = require('../../../database/models/building_level');
const Building_cost = require('../../../database/models/building_cost');
const Resource = require('../../../database/models/resource');
const Unit_production = require('../../../database/models/unit_production');
const Resource_production = require('../../../database/models/resource_production');
const Storage_building = require('../../../database/models/storage_building');
const Populaction_capacity = require('../../../database/models/population_capacity');
const Wall_defense = require('../../../database/models/wall_defense');
const BuildingService = require('../building.service');

class BuildingLevelService {
    /**
     * Return all building levels into promise
     * 
     * @returns {Promise<Building_level[]>}
     */
    getAll() {
        return Building_level.findAll();
    }

    /**
     * Return all building levels with their building costs into promise
     * 
     * @param {String} buildingName - The building name associated with the building levels
     * @returns {Promise<Building_level[]>}
     */
    getAllWithBuildingCosts(buildingName) {
        return Building_level.findAll({
            where: {
                building_name: buildingName
            },
            include: Building_cost,
            order: [
                ['level', 'ASC']
            ]
        })
    }

    /**
     * Return a building_level by id into promise
     * 
     * @param {Number} id - The building_level id
     * @throws {NotFoundError} - When the building_level is not found
     * @returns {Promise<Building_level>}
     */
    async getById(id) {
        const buildingLevel = await Building_level.findByPk(id);

        if (!buildingLevel) {
            throw new NotFoundError('Building_level not found');
        }

        return buildingLevel;
    }

    /**
     * Create the next level of a building with their building costs 
     * 
     * @param {Object} data - The building_level data
     * @returns {Promise<Building_level>}
     */
    async create(data) {
        const transaction = await sequelize.transaction()
        try {
            // Create the next level of a building
            const nextLevel = await Building_level.findOne({
                where: {
                    building_name: data.building_name
                },
                order: [
                    ['level', 'DESC']
                ]
            }).then(buildingLevel => buildingLevel ? buildingLevel.level + 1 : 1);

            data.level = nextLevel;
            const buildingLevel = await Building_level.create(data, { transaction });

            // Create base building costs for the new building level
            await this.#CreateLevelBuildingCosts(buildingLevel.id, transaction);

            // Creation of the bonus per level according to the type of building
            await this.#CreateLevelBuildingBonus(buildingLevel.id, data.building_name, nextLevel, transaction);
            
            await transaction.commit();
            return buildingLevel;
        }
        catch (error) {
            transaction.rollback();
            throw error;
        }
    }

    /**
     * Update a building_level
     * 
     * @param {Number} id - The building_level id
     * @param {Object} data - The building_level data
     * @returns {Promise<Building_level>}
     */
    update(id, data) {
        return Building_level.update(data, {
            where: {
                id
            }
        });
    }

    /**
     * Delete a building_level
     * 
     * @param {Number} id - The building_level id
     * @throws {NotFoundError} - When the building_level is not found
     * @returns {Promise<Building_level>}
     */
    async delete(id) {
        const buildingLevel = await this.getById(id);

        if (!buildingLevel) {
            throw new NotFoundError('Building_level not found');
        }

        return buildingLevel.destroy();
    }

    /**
     * Create all the building costs for the given building level 
     * 
     * @param {Number} buildingLevelId - The building level id
     * @param {Object} transaction - The transaction object
     * @returns {Promise<Building_cost[]>}
     */
    async #CreateLevelBuildingCosts(buildingLevelId, transaction) {
        const resources = await Resource.findAll();
        const buildingCostsPromises = resources.map(resource => {
            return Building_cost.create({
                quantity: 100,
                resource_name: resource.name,
                building_level_id: buildingLevelId,
            }, { transaction });
        })
        return Promise.all(buildingCostsPromises);
    }

    /**
     * Create the building level bonus for the given building level and building name
     * 
     * @param {Number} buildingLevelId - The building level id
     * @param {String} buildingName - The building name
     * @param {Number} nextLevel - The next level of the building
     * @param {Object} transaction - The transaction object
     * @returns {Promise<void>}
     */
    async #CreateLevelBuildingBonus (buildingLevelId, buildingName, nextLevel = 1, transaction) {
        const building = await BuildingService.getByName(buildingName);
        const buildingType = building.type;
        switch (buildingType) {
            case 'military_building':
                await Unit_production.create({
                    reduction_percent: 3 * nextLevel,
                    military_building_name: buildingName,
                    building_level_id: buildingLevelId,
                }, { transaction });
                break;
            case 'resource_building':
                await Resource_production.create({
                    production: 5 * nextLevel,
                    resource_building_name: buildingName,
                    building_level_id: buildingLevelId,
                }, { transaction });
                break;
            case 'storage_building':
                await Storage_building.create({
                    capacity: 420 * nextLevel,
                    storage_building_name: buildingName,
                    building_level_id: buildingLevelId,
                }, { transaction });
                break;
            case 'town_all_building':
                await Populaction_capacity.create({
                    capacity: 420 * nextLevel,
                    town_all_building_name: buildingName,
                    building_level_id: buildingLevelId,
                }, { transaction });
                break;
            case 'wall_building':
                await Wall_defense.create({
                    defense_percent: 3 * nextLevel,
                    wall_building_name: buildingName,
                    building_level_id: buildingLevelId,
                }, { transaction });
                break;
            default:
                break;
        }
    }
}

module.exports = new BuildingLevelService();