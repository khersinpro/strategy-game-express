const VillageBuildingService = require('./village_building.service');
class VillageBuildingController {
    
    /**
     * get all village buildings
     */
    async getAll (req, res, next) {
        try
        {
            const villageBuildings = await VillageBuildingService.getAll();
            res.status(200).json(villageBuildings);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a village building by id
     */
    async get (req, res, next) {
        try
        {
            const villageBuilding = await VillageBuildingService.getById(req.params.id);
            res.status(200).json(villageBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a village building
     */
    async create (req, res, next) {
        try
        {
            const villageBuilding = await VillageBuildingService.create(req.body);
            res.status(201).json(villageBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a village building
     */ 
    async update (req, res, next) {
        try
        {
            const villageBuilding = await VillageBuildingService.update(req.params.id, req.body);
            res.status(200).json(villageBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a village building
     */
    async delete (req, res, next) {
        try
        {
            await VillageBuildingService.delete(req.params.id);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new VillageBuildingController();