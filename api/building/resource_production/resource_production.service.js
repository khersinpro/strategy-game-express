const NotFoundError = require('../../../errors/not-found');
const { Resource_production } = require('../../../database/index').models;

class ResourceProductionService {

    /**
     * return all resource productions into promise
     * @returns {Promise<Resource_production[]>}
     */
    getAll() {
        return Resource_production.findAll();
    }

    /**
     * return a resource production by name into promise
     * @param {string} id
     * @throws {NotFoundError} When the resource production is not found
     * @returns {Promise<Resource_production>}
     */
    async getById(id) {
       const resourceProduction = await Resource_production.findByPk(id);
       
        if (!resourceProduction) {
            throw new NotFoundError('Resource_production not found');
        }

        return resourceProduction;
    }

    /**
     * Create a resource production
     * @param {Object} data
     * @returns {Promise<Resource_production>}
     */
    create(data) {
        return Resource_production.create(data);
    }

    /**
     * Update a resource production
     * @param {string} id
     * @param {Object} data
     * @returns {Promise<Resource_production>}
     */
    update(id, data) {
        return Resource_production.update(data, {
            where: {
                id
            }
        });
    }

    /**
     * Delete a resource production
     * @param {string} id
     * @throws {NotFoundError} When the resource production is not found
     * @returns {Promise<Resource_production>}
     */
    async delete(id) {
        const ressourceBuilding = await this.getById(id);

        if (!ressourceBuilding) {
            throw new NotFoundError('Resource_production not found');
        }

        return ressourceBuilding.destroy();
    }
}

module.exports = new ResourceProductionService();