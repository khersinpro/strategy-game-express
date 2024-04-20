const ResourceService  = require("./resource.service");

class ResourceController {

    /**
     * Get all resources
     * @returns {Promise<Resource[]>}
     */ 
    async getAll(req, res, next) {
        try {
            const resources = await ResourceService.getAll();
            res.status(200).json(resources);
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ResourceController();