const BuildingLevelService = require('./building_level.service');

class BuildingLevelController {
    
    /**
     * Get all Building levels
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
     * Get all Building levels with their building costs
     * 
     * @param {params} req.params.name - The building name associated with the building levels
     */
    async getAllWithBuildingCosts (req, res, next) {
        try {
            const levelsAndCosts = await BuildingLevelService.getAllWithBuildingCosts(req.params.name);
            res.status(200).json(levelsAndCosts);
        }
        catch (error) {
            next(error)
        }
    }

    /**
     * Get a Building level by id
     * 
     * @param {params} req.params.id - The building level id
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
     * Create a Building level
     * 
     * @param {Object} req.body - The building level data
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
     * 
     * @param {params} req.params.id - The building level id
     * @param {Object} req.body - The building level data
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
     * Delete a Building level
     * 
     * @param {params} req.params.id - The building level id
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