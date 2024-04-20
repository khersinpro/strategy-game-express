const NotFoundError = require('../../errors/not-found');
const Building      = require('../../database/models/building');

class BuildingService {

    /**
     * Return all buildings into promise
     * @param {number} limit
     * @param {number} page
     * @returns {Promise<Building[]>}
     */
    getAll(limit = 20, page = 1) {
        const offset = limit * (page - 1); 
        return Building.findAndCountAll({
            limit,
            offset
        });
    }

    /**
     * Return a building by name into promise
     * @param {string} name
     * @returns {Promise<Building>}
     */
    getByName(name) {
        return Building.findByPk(name);
    }

    /**
     * Create a building
     * @param {Object} data
     * @throws {NotFoundError} When the building is not created
     * @returns {Promise<Building>}
     */
    create(data) {
        const building = Building.create(data);

        if (!building) {
            throw new NotFoundError('Building not created');
        }

        return building;
    }

    /**
     * Update a building
     * @param {string} name
     * @param {Object} data
     * @returns {Promise<Building>}
     */
    update(name, data) {
        return Building.update(data, {
            where: {
                name
            }
        });
    }

    /**
     * Delete a building
     * @param {string} name
     * @throws {NotFoundError} When the building is not found
     * @returns {Promise<Building>}
     */
    async delete(name) {
        const building = await this.getByName(name);

        if (!building) {
            throw new NotFoundError('Building not found');
        }

        return building.destroy();
    }
}

module.exports = new BuildingService();