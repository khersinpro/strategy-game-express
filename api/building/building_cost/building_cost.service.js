const NotFoundError = require('../../../errors/not-found');
const { Building_cost } = require('../../../database').models;

class BuildingCostService {

    /**
     * return all building costs into promise
     * @returns {Promise<Building_cost[]>}
     */
    getAll() {
        return Building_cost.findAll();
    }

    /**
     * return a building cost by id into promise
     * @param {Number} id
     * @throws {NotFoundError} When the building cost is not found
     * @returns {Promise<Building_cost>}
     */
    async getById(id) {
       const buildingCost = await Building_cost.findByPk(id);
       
        if (!buildingCost) {
            throw new NotFoundError('Building_cost not found');
        }

        return buildingCost;
    }

    /**
     * Create a building cost
     * @param {Object} data
     * @returns {Promise<Building_cost>}
     */
    create(data) {
        return Building_cost.create(data);
    }

    /**
     * Update a building cost
     * @param {Number} id
     * @param {Object} data
     * @returns {Promise<Building_cost>}
     */
    update(id, data) {
        return Building_cost.update(data, {
            where: {
                id
            }
        });
    }

    /**
     * Delete a building cost
     * @param {Number} id
     * @throws {NotFoundError} When the building cost is not found
     * @returns {Promise<Building_cost>}
     */
    async delete(id) {
        const buildingCost = await this.getById(id);

        if (!buildingCost) {
            throw new NotFoundError('Building_cost not found');
        }

        return buildingCost.destroy();
    }
}

module.exports = new BuildingCostService();