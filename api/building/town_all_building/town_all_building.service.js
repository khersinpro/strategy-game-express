const NotFoundError     = require('../../../errors/not-found');
const Town_all_building = require('../../../database/models/town_all_building');

class TownAllBuildingService {
    /**
     * return all buildings into promise
     * @returns {Promise<Town_all_building[]>}
     */
    getAll() {
        return Town_all_building.findAll();
    }

    /**
     * return a building by name into promise
     * @param {string} name
     * @throws {NotFoundError} When the building is not found
     * @returns {Promise<Town_all_building>}
     */
    async getByName(name) {
       const townAllBuilding = await Town_all_building.findByPk(name);
       
        if (!townAllBuilding) {
            throw new NotFoundError('Town_all_building not found');
        }

        return townAllBuilding;
    }

    /**
     * Create a building
     * @param {Object} data
     * @returns {Promise<Town_all_building>}
     */
    create(data) {
        return Town_all_building.create(data);
    }

    /**
     * Update a building
     * @param {string} name
     * @param {Object} data
     * @returns {Promise<Town_all_building>}
     */
    update(name, data) {
        return Town_all_building.update(data, {
            where: {
                name
            }
        });
    }

    /**
     * Delete a building
     * @param {string} name
     * @throws {NotFoundError} When the building is not found
     * @returns {Promise<Town_all_building>}
     */
    async delete(name) {
        const townAllBuilding = await this.getByName(name);

        if (!townAllBuilding) {
            throw new NotFoundError('Town_all_building not found');
        }

        return townAllBuilding.destroy();
    }
}

module.exports = new TownAllBuildingService();