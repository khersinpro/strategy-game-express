const NotFoundError = require('../../../errors/not-found');
const Storage_building = require('../../../database/models/storage_building');
const { sequelize } = require('../../../database');
const Building = require('../../../database/models/building');

class StorageBuildingService {
    /**
     * return all buildings into promise
     * @returns {Promise<Storage_building[]>}
     */
    getAll() {
        return Storage_building.findAll();
    }

    /**
     * return a building by name into promise
     * @param {string} name
     * @throws {NotFoundError} When the building is not found
     * @returns {Promise<Storage_building>}
     */
    async getByName(name) {
        const storage_building = await Storage_building.findByPk(name);

        if (!storage_building) {
            throw new NotFoundError('Storage_building not found');
        }

        return storage_building;
    }

    /**
     * Create a resource building with his parent building
     * @param {Object} data - The building data
     * @param {string} data.name - The building name
     * @param {string} data.resource_name - The resource name
     * @returns {Promise<Storage_building>}
     */
    async create(data) {
        const transaction = await sequelize.transaction();
        try {
            const building = await Building.create({
                name: data.name,
                type: 'storage_building',
                is_common: true
            }, { transaction });

            const storage_building = await Storage_building.create({
                name: building.name,
                resource_name: data.resource_name
            }, { transaction });

            await transaction.commit();

            building.setDataValue('storage_building', storage_building);

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
     * @returns {Promise<Storage_building>}
     */
    update(name, data) {
        return Storage_building.update(data, {
            where: {
                name
            }
        });
    }

    /**
     * Delete a building
     * @param {string} name
     * @throws {NotFoundError} When the building is not found
     * @returns {Promise<Storage_building>}
     */
    async delete(name) {
        const storage_building = await this.getByName(name);

        if (!storage_building) {
            throw new NotFoundError('Storage_building not found');
        }

        return storage_building.destroy();
    }
}

module.exports = new StorageBuildingService();