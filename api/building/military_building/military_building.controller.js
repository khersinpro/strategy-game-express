const MilitaryBuildingService = require('./military_building.service');

class MilitaryBuildingController {
    
    /**
     * get all military buildings
     */
    async getAll (req, res, next) {
        try
        {
            const militaryBuildings = await MilitaryBuildingService.getAll();
            res.status(200).json(militaryBuildings);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a military building by name
     */
    async get (req, res, next) {
        try
        {
            const militaryBuilding = await MilitaryBuildingService.getByName(req.params.name);
            res.status(200).json(militaryBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a military building
     */
    async create (req, res, next) {
        try
        {
            const militaryBuilding = await MilitaryBuildingService.create(req.body);
            res.status(201).json(militaryBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a military building
     */ 
    async update (req, res, next) {
        try
        {
            const militaryBuilding = await MilitaryBuildingService.update(req.params.name, req.body);
            res.status(200).json(militaryBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a military building
     */
    async delete (req, res, next) {
        try
        {
            await MilitaryBuildingService.delete(req.params.name);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new MilitaryBuildingController();