const UnitCostService = require('./unit_cost.service');

class UnitCostController {
    /**
     * get all unit costs
     */
    async getAll(req, res, next) {
        try {
            const unitCosts = await UnitCostService.getAll();
            res.status(200).json(unitCosts);
        }
        catch (error) {
            next(error)
        }
    }


    /**
     * get all unit costs by unit name
     */ 
    async getAllByUnitName(req, res, next) {
        try {
            const unitCost = await UnitCostService.getAllByUnitName(req.params.name);
            res.status(200).json(unitCost);
        }
        catch (error) {
            next(error)
        }
    }

    /**
     * get a unit cost by id
     */
    async get(req, res, next) {
        try {
            const unitCost = await UnitCostService.getById(req.params.id);
            res.status(200).json(unitCost);
        }
        catch (error) {
            next(error)
        }
    }

    /**
     * create a unit cost
     */
    async create(req, res, next) {
        try {
            const unitCost = await UnitCostService.create(req.body);
            res.status(201).json(unitCost);
        }
        catch (error) {
            next(error)
        }
    }

    /**
     * update a unit cost
     */
    async update(req, res, next) {
        try {
            const unitCost = await UnitCostService.update(req.params.id, req.body);
            res.status(200).json(unitCost);
        }
        catch (error) {
            next(error)
        }
    }

    /**
     * delete a unit cost
     */
    async delete(req, res, next) {
        try {
            await UnitCostService.delete(req.params.id);
            res.status(204).end();
        }
        catch (error) {
            next(error)
        }
    }
}

module.exports = new UnitCostController();