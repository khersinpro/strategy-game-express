const StorageCapacityService = require('./storage_capacity.service');

class StorageCapacityController {
     /**
     * get all storage capacities
     */
     async getAll (req, res, next) {
        try
        {
            const storageCapacities = await StorageCapacityService.getAll();
            res.status(200).json(storageCapacities);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get all storage capacities with included building level by building name
     * 
     * @param {string} name - The name of the building
     */ 
    async getAllWithLevelByBuildingName(req, res, next) {
        try
        {
            const storageCapacities = await StorageCapacityService.getAllWithLevelByBuildingName(req.params.name);
            res.status(200).json(storageCapacities);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a storage capacity by id
     */
    async get (req, res, next) {
        try
        {
            const storageCapacity = await StorageCapacityService.getById(req.params.id);
            res.status(200).json(storageCapacity);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a storage capacity
     */
    async create (req, res, next) {
        try
        {
            const storageCapacity = await StorageCapacityService.create(req.body);
            res.status(201).json(storageCapacity);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a storage capacity
     */ 
    async update (req, res, next) {
        try
        {
            const storageCapacity = await StorageCapacityService.update(req.params.id, req.body);
            res.status(200).json(storageCapacity);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a storage capacity
     */
    async delete (req, res, next) {
        try
        {
            await StorageCapacityService.delete(req.params.id);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new StorageCapacityController();