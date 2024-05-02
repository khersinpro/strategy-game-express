const NotFoundError = require('../../../errors/not-found');
const Military_building = require('../../../database/models/military_building');
const { sequelize } = require('../../../database/index');
const Building = require('../../../database/models/building');

class MilitaryBuildingService {
    /**
     * return all buildings into promise
     * @returns {Promise<Military_building[]>}
     */
    getAll() {
        return Military_building.findAll();
    }

    /**
     * return a building by name into promise
     * @param {string} name
     * @throws {NotFoundError} When the building is not found
     * @returns {Promise<Military_building>}
     */
    async getByName(name) {
        const militaryBuilding = await Military_building.findByPk(name);

        if (!militaryBuilding) {
            throw new NotFoundError('Military_building not found');
        }

        return militaryBuilding;
    }

    /**
     * Create a military building with his parent building
     * @param {Object} data - The building data
     * @param {string} data.name - The building name
     * @param {string} data.unit_type - The unit type
     * @returns {Promise<Military_building>} - The created building
     */
    async create(data) {
        const transaction = await sequelize.transaction();
        try {
            const building = await Building.create({
                name: data.name,
                type: 'military_building',
                is_common: true
            }, { transaction });

            const militaryBuilding = await Military_building.create({
                name: building.name,
                unit_type: data.unit_type
            }, { transaction });

            await transaction.commit();

            building.setDataValue('military_building', militaryBuilding);

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
     * @returns {Promise<Military_building>}
     */
    update(name, data) {
        return Military_building.update(data, {
            where: {
                name
            }
        });
    }

    /**
     * Delete a building
     * @param {string} name
     * @throws {NotFoundError} When the building is not found
     * @returns {Promise<Military_building>}
     */
    async delete(name) {
        const militaryBuilding = await this.getByName(name);

        if (!militaryBuilding) {
            throw new NotFoundError('Military_building not found');
        }

        return militaryBuilding.destroy();
    }
}

module.exports = new MilitaryBuildingService();