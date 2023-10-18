const NotFoundError = require('../../../errors/not-found');
const { Building_level } = require('../../../database').models;

class BuildingLevelService {

    /**
     * return all building levels into promise
     * @returns {Promise<Building_level[]>}
     */
    getAll() {
        return Building_level.findAll();
    }

    /**
     * return a building_level by id into promise
     * @param {Number} id
     * @throws {NotFoundError} When the building_level is not found
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
     * Create a building_level
     * @param {Object} data
     * @returns {Promise<Building_level>}
     */
    create(data) {
        return Building_level.create(data);
    }

    /**
     * Update a building_level
     * @param {Number} id
     * @param {Object} data
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
     * @param {Number} id
     * @throws {NotFoundError} When the building_level is not found
     * @returns {Promise<Building_level>}
     */
    async delete(id) {
        const buildingLevel = await this.getById(id);

        if (!buildingLevel) {
            throw new NotFoundError('Building_level not found');
        }

        return buildingLevel.destroy();
    }
}

module.exports = new BuildingLevelService();