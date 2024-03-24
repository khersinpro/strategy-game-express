const NotFoundError     = require('../../../errors/not-found');
const Military_building = require('../../../database/models/military_building');

class MilitaryBuildingService {
    /**
     * return all buildings into promise
     * @returns {Promise<Military_building[]>}
     */
    getAll() {
        return Military_building.findAll();
    }

    /**
     * return a building by name into promise
     * @param {string} name
     * @throws {NotFoundError} When the building is not found
     * @returns {Promise<Military_building>}
     */
    async getByName(name) {
       const militaryBuilding = await Military_building.findByPk(name);
       
        if (!militaryBuilding) {
            throw new NotFoundError('Military_building not found');
        }

        return militaryBuilding;
    }

    /**
     * Create a building
     * @param {Object} data
     * @returns {Promise<Military_building>}
     */
    create(data) {
        return Military_building.create(data);
    }

    /**
     * Update a building
     * @param {string} name
     * @param {Object} data
     * @returns {Promise<Military_building>}
     */
    update(name, data) {
        return Military_building.update(data, {
            where: {
                name
            }
        });
    }

    /**
     * Delete a building
     * @param {string} name
     * @throws {NotFoundError} When the building is not found
     * @returns {Promise<Military_building>}
     */
    async delete(name) {
        const militaryBuilding = await this.getByName(name);

        if (!militaryBuilding) {
            throw new NotFoundError('Military_building not found');
        }

        return militaryBuilding.destroy();
    }
}

module.exports = new MilitaryBuildingService();