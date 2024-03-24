const NotFoundError     = require('../../../errors/not-found');
const Storage_building  = require('../../../database/models/storage_building');

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
     * Create a building
     * @param {Object} data
     * @returns {Promise<Storage_building>}
     */
    create(data) {
        return Storage_building.create(data);
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