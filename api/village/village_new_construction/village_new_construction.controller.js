const VillageNewConstructionService = require('./village_new_construction.service');

class VillageUnitController {
    /**
     * get all village_new_construction 
     */
    async getAll (req, res, next) {
        try
        {
            const villageNewConstructions = await VillageNewConstructionService.getAll();
            res.status(200).json(villageNewConstructions);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a village_new_construction by id
     */
    async get (req, res, next) {
        try
        {
            const villageNewConstruction = await VillageNewConstructionService.getById(req.params.id);
            res.status(200).json(villageNewConstruction);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a village_new_construction
     */
    async create (req, res, next) {
        try
        {
            const villageNewConstruction = await VillageNewConstructionService.create(req.body);
            res.status(201).json(villageNewConstruction);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a village_new_construction
     */ 
    async update (req, res, next) {
        try
        {
            const villageNewConstruction = await VillageNewConstructionService.update(req.params.id, req.body);
            res.status(200).json(villageNewConstruction);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a village_new_construction
     */
    async delete (req, res, next) {
        try
        {
            await VillageNewConstructionService.delete(req.params.id);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new VillageUnitController();