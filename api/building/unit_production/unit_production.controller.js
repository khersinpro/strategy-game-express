const UnitProductionService = require('./unit_production.service');

class UnitProductionController {
    /**
     * Return all unit productions
     */
    async getAll(req, res, next) {
        try {
            const unitProductions = await UnitProductionService.getAll()
            res.status(200).json(unitProductions)
        }
        catch (error) {
            next(error)
        }
    }

    /**
     * Return all unit productions with included building level by building name
     * 
     * @param {string} buildingName - The name of the building
     */
    async getAllWithLevelByBuildingName(req, res, next) {
        try {
            const unitProductions = await UnitProductionService.getAllWithLevelByBuildingName(req.params.buildingName)
            res.status(200).json(unitProductions)
        }
        catch (error) {
            next(error)
        }
    }

    /**
     * Return a unit production by id
     * 
     * @param {number} id - The id of the unit production
     */
    async getById(req, res, next) {
        try {
            const unitProduction = await UnitProductionService.getById(req.params.id)
            res.status(200).json(unitProduction)
        }
        catch (error) {
            next(error)
        }
    }

    /**
     * Create a unit production
     * 
     * @param {Object} data - The data of the unit production
     */
    async create(req, res, next) {
        try {
            const unitProduction = await UnitProductionService.create(req.body)
            res.status(201).json(unitProduction)
        }
        catch (error) {
            next(error)
        }
    }

    /**
     * Update a unit production
     * 
     * @param {number} id - The id of the unit production
     * @param {Object} data - The data of the unit production
     */
    async update(req, res, next) {
        try {
            const unitProduction = await UnitProductionService.update(req.params.id, {
                capacity: req.body.capacity
            })
            res.status(200).json(unitProduction)
        }
        catch (error) {
            next(error)
        }
    }

    /**
     * Delete a unit production
     * 
     * @param {number} id - The id of the unit production
     */
    async deleteUnitProduction(req, res, next) {
        try {
            await UnitProductionService.delete(req.params.id)
            res.status(204).end()
        }
        catch (error) {
            next(error)
        }
    }
}

module.exports = new UnitProductionController()