const Resource = require('../../database/models/resource');

class ResourceService {
    /**
     * Get all resources
     * @returns {Promise<Resource[]>}
     */
    getAll() {
        return Resource.findAll();
    }
}

module.exports = new ResourceService();