const ressource_buildingService = require('./resource_production.service');

class RessourceBuildingController {
       
    /**
     * get all ressource buildings
     */
    async getAll (req, res, next) {
        try
        {
            const ressourceBuildings = await ressource_buildingService.getAll();
            res.status(200).json(ressourceBuildings);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a ressource building by name
     */
    async get (req, res, next) {
        try
        {
            const ressourceBuilding = await ressource_buildingService.getByName(req.params.name);
            res.status(200).json(ressourceBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a ressource building
     */
    async create (req, res, next) {
        try
        {
            const ressourceBuilding = await ressource_buildingService.create(req.body);
            res.status(201).json(ressourceBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a ressource building
     */ 
    async update (req, res, next) {
        try
        {
            const ressourceBuilding = await ressource_buildingService.update(req.params.name, req.body);
            res.status(200).json(ressourceBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a ressource building
     */
    async delete (req, res, next) {
        try
        {
            await ressource_buildingService.delete(req.params.name);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new RessourceBuildingController();