const NotFoundError = require('../../../errors/not-found');
const Building_type = require('../../../database/models/building_type');

class BuildingTypeService {
    /**
     * return all building types into promise
     * @returns {Promise<Building_type[]>}
     */
    getAll() {
        return Building_type.findAll();
    }

    /**
     * return a building type by name into promise
     * @param {String} name
     * @throws {NotFoundError} When the building type is not found
     * @returns {Promise<Building_type>}
     */
    async getByName(name) {
       const buildingType = await Building_type.findByPk(name);
       
        if (!buildingType) {
            throw new NotFoundError('Building_type not found');
        }

        return buildingType;
    }

    /**
     * Create a building type
     * @param {Object} data
     * @returns {Promise<Building_type>}
     */
    create(data) {
        return Building_type.create(data);
    }

    /**
     * Update a building type
     * @param {String} name
     * @param {Object} data
     * @returns {Promise<Building_type>}
     */
    update(name, data) {
        return Building_type.update(data, {
            where: {
                name
            }
        });
    }

    /**
     * Delete a building type
     * @param {String} name
     * @throws {NotFoundError} When the building type is not found
     * @returns {Promise<Building_type>}
     */
    async delete(name) {
        const buildingType = await this.getByName(name);

        if (!buildingType) {
            throw new NotFoundError('Building_type not found');
        }

        return buildingType.destroy();
    }
}

module.exports = new BuildingTypeService();