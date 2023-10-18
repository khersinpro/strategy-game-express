const BuildingCostService = require('./building_cost.service');

class BuildingCostController {
    
    /**
     * get all building costs
     */
    async getAll (req, res, next) {
        try
        {
            const buildingCosts = await BuildingCostService.getAll();
            res.status(200).json(buildingCosts);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a building cost by id
     */
    async get (req, res, next) {
        try
        {
            const buildingCost = await BuildingCostService.getById(req.params.id);
            res.status(200).json(buildingCost);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a building cost
     */
    async create (req, res, next) {
        try
        {
            const buildingCost = await BuildingCostService.create(req.body);
            res.status(201).json(buildingCost);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a building cost
     */ 
    async update (req, res, next) {
        try
        {
            const buildingCost = await BuildingCostService.update(req.params.id, req.body);
            res.status(200).json(buildingCost);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a building cost
     */
    async delete (req, res, next) {
        try
        {
            await BuildingCostService.delete(req.params.id);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new BuildingCostController();