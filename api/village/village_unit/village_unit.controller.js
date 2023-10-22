const VillageUnitService = require('./village_unit.service');
class VillageUnitController {
    
    /**
     * get all village units
     */
    async getAll (req, res, next) {
        try
        {
            const villageUnits = await VillageUnitService.getAll();
            res.status(200).json(villageUnits);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a village unit by id
     */
    async get (req, res, next) {
        try
        {
            const villageUnit = await VillageUnitService.getById(req.params.id);
            res.status(200).json(villageUnit);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a village unit
     */
    async create (req, res, next) {
        try
        {
            const villageUnit = await VillageUnitService.create(req.body);
            res.status(201).json(villageUnit);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a village unit
     */ 
    async update (req, res, next) {
        try
        {
            const villageUnit = await VillageUnitService.update(req.params.id, req.body);
            res.status(200).json(villageUnit);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a village unit
     */
    async delete (req, res, next) {
        try
        {
            await VillageUnitService.delete(req.params.id);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new VillageUnitController();