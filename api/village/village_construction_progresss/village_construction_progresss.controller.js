const VillageConstructionProgressService = require('./village_construction_progresss.service');
class VillageUnitController {
    
    /**
     * get all village_production_progresss 
     */
    async getAll (req, res, next) {
        try
        {
            const villageConstructionProgresses = await VillageConstructionProgressService.getAll();
            res.status(200).json(villageConstructionProgresses);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a village_production_progresss by id
     */
    async get (req, res, next) {
        try
        {
            const villageConstructionProgress = await VillageConstructionProgressService.getById(req.params.id);
            res.status(200).json(villageConstructionProgress);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a village_production_progresss
     */
    async create (req, res, next) {
        try
        {
            const villageConstructionProgress = await VillageConstructionProgressService.create(req.body);
            res.status(201).json(villageConstructionProgress);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a village_production_progresss
     */ 
    async update (req, res, next) {
        try
        {
            const villageConstructionProgress = await VillageConstructionProgressService.update(req.params.id, req.body);
            res.status(200).json(villageConstructionProgress);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a village_production_progresss
     */
    async delete (req, res, next) {
        try
        {
            await VillageConstructionProgressService.delete(req.params.id);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new VillageUnitController();