const NotFoundError = require('../../../errors/not-found');
const { Wall_building } = require('../../../database').models;

class WallBuildingService {

    /**
     * return all buildings into promise
     * @returns {Promise<Wall_building[]>}
     */
    getAll() {
        return Wall_building.findAll();
    }

    /**
     * return a building by name into promise
     * @param {string} name
     * @throws {NotFoundError} When the building is not found
     * @returns {Promise<Wall_building>}
     */
    async getByName(name) {
       const wallBuilding = await Wall_building.findByPk(name);
       
        if (!wallBuilding) {
            throw new NotFoundError('Wall_building not found');
        }

        return wallBuilding;
    }

    /**
     * Create a building
     * @param {Object} data
     * @returns {Promise<Wall_building>}
     */
    create(data) {
        return Wall_building.create(data);
    }

    /**
     * Update a building
     * @param {string} name
     * @param {Object} data
     * @returns {Promise<Wall_building>}
     */
    update(name, data) {
        return Wall_building.update(data, {
            where: {
                name
            }
        });
    }

    /**
     * Delete a building
     * @param {string} name
     * @throws {NotFoundError} When the building is not found
     * @returns {Promise<Wall_building>}
     */
    async delete(name) {
        const wallBuilding = await this.getByName(name);

        if (!wallBuilding) {
            throw new NotFoundError('Wall_building not found');
        }

        return wallBuilding.destroy();
    }
}

module.exports = new WallBuildingService();