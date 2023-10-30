const VillageUpdateConstructionService = require('./village_update_construction.service');

class VillageUpdateConstructionController {
    /**
     * get all village_update_construction 
     */
    async getAll (req, res, next) {
        try
        {
            const villageUpdateContructions = await VillageUpdateConstructionService.getAll();
            res.status(200).json(villageUpdateContructions);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a village_update_construction by id
     */
    async get (req, res, next) {
        try
        {
            const villageUpdateContruction = await VillageUpdateConstructionService.getById(req.params.id);
            res.status(200).json(villageUpdateContruction);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a village_update_construction
     */
    async create (req, res, next) {
        try
        {
            const villageUpdateContruction = await VillageUpdateConstructionService.create(req.body);
            res.status(201).json(villageUpdateContruction);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a village_update_construction
     */ 
    async update (req, res, next) {
        try
        {
            const villageUpdateContruction = await VillageUpdateConstructionService.update(req.params.id, req.body);
            res.status(200).json(villageUpdateContruction);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a village_update_construction
     */
    async delete (req, res, next) {
        try
        {
            await VillageUpdateConstructionService.delete(req.params.id);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new VillageUpdateConstructionController();