const NotFoundError     = require('../../../errors/not-found');
const Special_building  = require('../../../database/models/special_building');

class BuildingService {
    /**
     * return all buildings into promise
     * @returns {Promise<Special_building[]>}
     */
     getAll() {
        return Special_building.findAll();
    }

    /**
     * return a building by name into promise
     * @param {string} name
     * @throws {NotFoundError} When the building is not found
     * @returns {Promise<Special_building>}
     */
    async getByName(name) {
       const specialBuilding = await Special_building.findByPk(name);
       
        if (!specialBuilding) {
            throw new NotFoundError('Special_building not found');
        }

        return specialBuilding;
    }

    /**
     * Create a building
     * @param {Object} data
     * @returns {Promise<Special_building>}
     */
    create(data) {
        return Special_building.create(data);
    }

    /**
     * Update a building
     * @param {string} name
     * @param {Object} data
     * @returns {Promise<Special_building>}
     */
    update(name, data) {
        return Special_building.update(data, {
            where: {
                name
            }
        });
    }

    /**
     * Delete a building
     * @param {string} name
     * @throws {NotFoundError} When the building is not found
     * @returns {Promise<Special_building>}
     */
    async delete(name) {
        const specialBuilding = await this.getByName(name);

        if (!specialBuilding) {
            throw new NotFoundError('Special_building not found');
        }

        return specialBuilding.destroy();
    }
}

module.exports = new BuildingService();