const NotFoundError = require('../../../errors/not-found');
const { Storage_capacity } = require('../../../database/index').models;

class StorageCapacityService {

    /**
     * return all storage capacities into promise
     * @returns {Promise<Storage_capacity[]>}
     */
    getAll() {
        return Storage_capacity.findAll();
    }

    /**
     * return a storage capacity by id into promise
     * @param {Number} id
     * @throws {NotFoundError} When the storage capacity is not found
     * @returns {Promise<Storage_capacity>}
     */
    async getById(id) {
       const storage_capacity = await Storage_capacity.findByPk(id);
       
        if (!storage_capacity) {
            throw new NotFoundError('Storage_capacity not found');
        }

        return storage_capacity;
    }

    /**
     * Create a storage capacity
     * @param {Object} data
     * @returns {Promise<Storage_capacity>}
     */
    create(data) {
        return Storage_capacity.create(data);
    }

    /**
     * Update a storage capacity
     * @param {Number} id
     * @param {Object} data
     * @returns {Promise<Storage_capacity>}
     */
    update(id, data) {
        return Storage_capacity.update(data, {
            where: {
                id
            }
        });
    }

    /**
     * Delete a storage capacity
     * @param {Number} id
     * @throws {NotFoundError} When the storage capacity is not found
     * @returns {Promise<Storage_capacity>}
     */
    async delete(id) {
        const storage_capacity = await this.getById(id);

        if (!storage_capacity) {
            throw new NotFoundError('Storage_capacity not found');
        }

        return storage_capacity.destroy();
    }
}

module.exports = new StorageCapacityService();