const NotFoundError = require("../../errors/not-found");
const ResourceService  = require("./resource.service");

class ResourceController {

    /**
     * Get all resources
     */ 
    async getAll(req, res, next) {
        try {
            const resources = await ResourceService.getAll();
            res.status(200).json(resources);
        } catch (error) {
            next(error)
        }
    }

    /**
     * Get a resource by name
     * @throws {NotFoundError} - If the resource does not exist
     */
    async get(req, res, next) {
        try {
            const resource = await ResourceService.getByName(req.params.name);

            if (!resource) {
                throw new NotFoundError(`Resource with name ${req.params.name} not found`);
            }

            res.status(200).json(resource);
        } catch (error) {
            next(error)
        }
    }

    /**
     * Create a new resource
     */
    async create(req, res, next) {
        try {
            const resource = await ResourceService.create(req.body);
            res.status(201).json(resource);
        } catch (error) {
            next(error)
        }
    }

    /**
     * Update a resource
     */
    async update(req, res, next) {
        try {
            const resource = await ResourceService.update(req.params.name, req.body);
            res.status(200).json(resource);
        } catch (error) {
            next(error)
        }
    }

    /**
     * Delete a resource
     */
    async delete(req, res, next) {
        try {
            await ResourceService.delete(req.params.name);
            res.status(204).end();
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ResourceController();