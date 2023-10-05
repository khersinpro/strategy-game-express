const WallBuildingService = require('./wall_building.service');

class WallBuildingController {
    
    /**
     * get all wall buildings
     */
    async getAll (req, res, next) {
        try
        {
            const wallBuildings = await WallBuildingService.getAll();
            res.status(200).json(wallBuildings);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a wall building by name
     */
    async get (req, res, next) {
        try
        {
            const wallBuilding = await WallBuildingService.getByName(req.params.name);
            res.status(200).json(wallBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a wall building
     */
    async create (req, res, next) {
        try
        {
            const wallBuilding = await WallBuildingService.create(req.body);
            res.status(201).json(wallBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a wall building
     */ 
    async update (req, res, next) {
        try
        {
            const wallBuilding = await WallBuildingService.update(req.params.name, req.body);
            res.status(200).json(wallBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a wall building
     */
    async delete (req, res, next) {
        try
        {
            await WallBuildingService.delete(req.params.name);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new WallBuildingController();