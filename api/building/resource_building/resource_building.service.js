const NotFoundError = require('../../../errors/not-found');
const { Resource_building } = require('../../../database/index').models;

class BuildingService {

    /**
     * return all buildings into promise
     * @returns {Promise<Resource_building[]>}
     */
    getAll() {
        console.log(Resource_building);
        return Resource_building.findAll();
    }

    /**
     * return a building by name into promise
     * @param {string} name
     * @throws {NotFoundError} When the building is not found
     * @returns {Promise<Resource_building>}
     */
    async getByName(name) {
       const ressourceBuilding = await Resource_building.findByPk(name);
       
        if (!ressourceBuilding) {
            throw new NotFoundError('Resource_building not found');
        }

        return ressourceBuilding;
    }

    /**
     * Create a building
     * @param {Object} data
     * @returns {Promise<Resource_building>}
     */
    create(data) {
        return Resource_building.create(data);
    }

    /**
     * Update a building
     * @param {string} name
     * @param {Object} data
     * @returns {Promise<Resource_building>}
     */
    update(name, data) {
        return Resource_building.update(data, {
            where: {
                name
            }
        });
    }

    /**
     * Delete a building
     * @param {string} name
     * @throws {NotFoundError} When the building is not found
     * @returns {Promise<Resource_building>}
     */
    async delete(name) {
        const ressourceBuilding = await this.getByName(name);

        if (!ressourceBuilding) {
            throw new NotFoundError('Resource_building not found');
        }

        return ressourceBuilding.destroy();
    }
}

module.exports = new BuildingService();