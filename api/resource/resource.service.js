const Resource = require('../../database/models/resource');

class ResourceService {
    /**
     * Get all resources
     * @returns {Promise<Resource[]>}
     */
    getAll() {
        return Resource.findAll();
    }

    /**
     * Get a resource by its name
     * @param {string} name
     * @returns {Promise<Resource>}
     */
    getByName(name) {
        return Resource.findOne({ where: { name } });
    }

    /**
     * Create a new resource
     * @param {Object} resource
     * @param {string} resource.name
     * @returns {Promise<Resource>}
     */
    create(resource) {
        return Resource.create(resource);
    }

    /**
     * Update a resource
     * @param {string} name
     * @param {Object} resource
     * @param {string} resource.name
     * @returns {Promise<Resource>}
     */
    update(name, resource) {
        return Resource.update(resource, { where: { name } });
    }

    /**
     * Delete a resource
     * @param {string} name
     * @returns {Promise<void>}
     */
    delete(name) {
        return Resource.destroy({ where: { name } });
    }
}

module.exports = new ResourceService();