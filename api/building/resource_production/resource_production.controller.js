const ResourceProductionService = require('./resource_production.service');

class ResourceProductionController {
       
    /**
     * get all resource productions
     */
    async getAll (req, res, next) {
        try
        {
            const resourceProductions = await ResourceProductionService.getAll();
            res.status(200).json(resourceProductions);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a resource production by id
     */
    async get (req, res, next) {
        try
        {
            const resourceProduction = await ResourceProductionService.getById(req.params.id);
            res.status(200).json(resourceProduction);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a resource production
     */
    async create (req, res, next) {
        try
        {
            const resourceProduction = await ResourceProductionService.create(req.body);
            res.status(201).json(resourceProduction);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a resource production
     */ 
    async update (req, res, next) {
        try
        {
            const resourceProduction = await ResourceProductionService.update(req.params.id, req.body);
            res.status(200).json(resourceProduction);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a resource production
     */
    async delete (req, res, next) {
        try
        {
            await ResourceProductionService.delete(req.params.id);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new ResourceProductionController();