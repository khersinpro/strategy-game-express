const BuildingService  = require('./building.service');

class BuildingController {

    /**
     * Return all buildings 
     */
    async getAll (req, res, next) {
        try
        {
            const buildings = await BuildingService.getAll();
            res.status(200).json(buildings);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * Return a building by name
     */
    async get (req, res, next) {
        try
        {
            const building = await BuildingService.getByName(req.params.name);
            res.status(200).json(building);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * Create a building 
     */
    async create (req, res, next) {
        try
        {
            const building = await BuildingService.create(req.body);
            res.status(201).json(building);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * Update a building 
     */
    async update (req, res, next) {
        try
        {
            const building = await BuildingService.update(req.params.name, req.body);
            res.status(200).json(building);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * Delete a building 
     */
    async delete (req, res, next) {
        try
        {
            await BuildingService.delete(req.params.name);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new BuildingController();