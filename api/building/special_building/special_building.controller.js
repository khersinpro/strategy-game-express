const SpecialBuildingService = require('./special_building.service');
class SpecialBuildingController {
    
    /**
     * get all special buildings
     */
    async getAll (req, res, next) {
        try
        {
            const specialBuildings = await SpecialBuildingService.getAll();
            res.status(200).json(specialBuildings);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a special building by name
     */
    async get (req, res, next) {
        try
        {
            const specialBuilding = await SpecialBuildingService.getByName(req.params.name);
            res.status(200).json(specialBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a special building
     */
    async create (req, res, next) {
        try
        {
            const specialBuilding = await SpecialBuildingService.create(req.body);
            res.status(201).json(specialBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a special building
     */ 
    async update (req, res, next) {
        try
        {
            const specialBuilding = await SpecialBuildingService.update(req.params.name, req.body);
            res.status(200).json(specialBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a special building
     */
    async delete (req, res, next) {
        try
        {
            await SpecialBuildingService.delete(req.params.name);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new SpecialBuildingController();