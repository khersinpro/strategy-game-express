const TownAllBuildingService = require('./town_all_building.service');

class TownAllBuildingController {
     /**
     * get all town all buildings
     */
     async getAll (req, res, next) {
        try
        {
            const townAllBuildings = await TownAllBuildingService.getAll();
            res.status(200).json(townAllBuildings);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a town all building by name
     * @param {string} req.params.name - name of the town all building
     */
    async get (req, res, next) {
        try
        {
            const townAllBuilding = await TownAllBuildingService.getByName(req.params.name);
            res.status(200).json(townAllBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a town all building
     * @param {Object} req.body - data to create
     */
    async create (req, res, next) {
        try
        {
            const townAllBuilding = await TownAllBuildingService.create(req.body);
            res.status(201).json(townAllBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a town all building
     * @param {string} req.params.name - name of the town all building
     * @param {Object} req.body - data to update
     */ 
    async update (req, res, next) {
        try
        {
            const townAllBuilding = await TownAllBuildingService.update(req.params.name, req.body);
            res.status(200).json(townAllBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a town all building
     * @param {string} req.params.name - name of the town all building
     */
    async delete (req, res, next) {
        try
        {
            await TownAllBuildingService.delete(req.params.name);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new TownAllBuildingController();