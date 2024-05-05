const NotFoundError = require('../../errors/not-found');
const Building = require('../../database/models/building');

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
     * Get a building by name
     * 
     * @param {string} name - The building name
     * @throws {NotFoundError} - When the building is not found
     * @returns {Promise<Building>}
     */
    async getByName(name) {
        try {
            const building = await Building.findOne({
                where: {
                    name
                }
            });

            if (!building) {
                throw new NotFoundError(`Building with name ${name} not found`);
            }
            
            return building;
        }
        catch (error) {
            throw error
        }
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