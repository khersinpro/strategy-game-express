const NotFoundError = require('../../../errors/not-found');

const { Infrastructure_building } = require('../../../database/index').models;

class InfrastructureBuildingService {

    /**
     * return all buildings into promise
     * @returns {Promise<Infrastructure_building[]>}
     */
    getAll() {
        return Infrastructure_building.findAll();
    }

    /**
     * return a building by name into promise
     * @param {string} name
     * @throws {NotFoundError} When the building is not found
     * @returns {Promise<Infrastructure_building>}
     */
    async getByName(name) {
       const infrastructureBuilding = await Infrastructure_building.findByPk(name);
       
        if (!infrastructureBuilding) {
            throw new NotFoundError('Infrastructure_building not found');
        }

        return infrastructureBuilding;
    }

    /**
     * Create a building
     * @param {Object} data
     * @returns {Promise<Infrastructure_building>}
     */
    create(data) {
        return Infrastructure_building.create(data);
    }

    /**
     * Update a building
     * @param {string} name
     * @param {Object} data
     * @returns {Promise<Infrastructure_building>}
     */
    update(name, data) {
        return Infrastructure_building.update(data, {
            where: {
                name
            }
        });
    }

    /**
     * Delete a building
     * @param {string} name
     * @throws {NotFoundError} When the building is not found
     * @returns {Promise<Infrastructure_building>}
     */
    async delete(name) {
        const infrastructureBuilding = await this.getByName(name);

        if (!infrastructureBuilding) {
            throw new NotFoundError('Infrastructure_building not found');
        }

        return infrastructureBuilding.destroy();
    }
}

module.exports = new InfrastructureBuildingService();