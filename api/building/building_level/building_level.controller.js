const BuildingLevelService = require('./building_level.service');

class BuildingLevelController {
    
    /**
     * get all Building levels
     */
    async getAll (req, res, next) {
        try
        {
            const buildingLevels = await BuildingLevelService.getAll();
            res.status(200).json(buildingLevels);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a Building level by id
     */
    async get (req, res, next) {
        try
        {
            const buildingLevel = await BuildingLevelService.getById(req.params.id);
            res.status(200).json(buildingLevel);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a Building level
     */
    async create (req, res, next) {
        try
        {
            const buildingLevel = await BuildingLevelService.create(req.body);
            res.status(201).json(buildingLevel);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a Building level
     */ 
    async update (req, res, next) {
        try
        {
            const buildingLevel = await BuildingLevelService.update(req.params.id, req.body);
            res.status(200).json(buildingLevel);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a Building level
     */
    async delete (req, res, next) {
        try
        {
            await BuildingLevelService.delete(req.params.id);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new BuildingLevelController();