const NotFoundError      = require('../../../errors/not-found');
const Resource_building  = require('../../../database/models/resource_building');
const { sequelize } = require('../../../database/index');
const Building = require('../../../database/models/building');

class BuildingService {
    /**
     * return all buildings into promise
     * @returns {Promise<Resource_building[]>}
     */
    getAll() {
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
     * Create a resource building with his parent building
     * @param {Object} data - The building data
     * @param {string} data.name - The building name
     * @param {string} data.resource_name - The resource name
     * @returns {Promise<Resource_building>}
     */
    async create(data) {
        const transaction = await sequelize.transaction();
        try {   
            const building = await Building.create({
                name: data.name,
                type: 'resource_building',
                is_common: true
            }, { transaction });


            const resourceBuilding = await Resource_building.create({
                name: building.name,
                resource_name: data.resource_name
            }, { transaction });

            await transaction.commit();

            building.setDataValue('resource_building', resourceBuilding);

            return building;
        }
        catch (error) {
            console.log(error);
            transaction.rollback();
            throw error;
        }
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