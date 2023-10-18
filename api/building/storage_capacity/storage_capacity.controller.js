const StorageBuildingService = require('./storage_capacity.service');

class StorageBuildingController {
     /**
     * get all storage buildings
     */
     async getAll (req, res, next) {
        try
        {
            const storageBuildings = await StorageBuildingService.getAll();
            res.status(200).json(storageBuildings);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a storage building by name
     */
    async get (req, res, next) {
        try
        {
            const storageBuilding = await StorageBuildingService.getByName(req.params.name);
            res.status(200).json(storageBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a storage building
     */
    async create (req, res, next) {
        try
        {
            const storageBuilding = await StorageBuildingService.create(req.body);
            res.status(201).json(storageBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a storage building
     */ 
    async update (req, res, next) {
        try
        {
            const storageBuilding = await StorageBuildingService.update(req.params.name, req.body);
            res.status(200).json(storageBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a storage building
     */
    async delete (req, res, next) {
        try
        {
            await StorageBuildingService.delete(req.params.name);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new StorageBuildingController();