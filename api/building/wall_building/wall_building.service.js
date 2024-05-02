const NotFoundError = require('../../../errors/not-found');
const Wall_building = require('../../../database/models/wall_building');
const { sequelize } = require('../../../database');
const Building = require('../../../database/models/building');

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
     * Create a wall building with his parent building  
     * @param {Object} data - The building data
     * @param {string} data.name - The building name
     * @param {string} data.civilization_name - The civilization name
     * @returns {Promise<Wall_building>} - The created building
     */
    async create(data) {
        const transaction = await sequelize.transaction();
        try {
            const building = await Building.create({
                name: data.name,
                type: 'wall_building',
                is_common: false
            }, { transaction });

            const wallBuilding = await Wall_building.create({
                name: building.name,
                civilization_name: data.civilization_name
            }, { transaction });

            await transaction.commit();

            building.setDataValue('wall_building', wallBuilding);

            return building;
        }
        catch (error) {
            transaction.rollback();
            throw error;
        }
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