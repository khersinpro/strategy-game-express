const VillageResourceService = require('./village_resource.service');
class VillageResourceController {
    
    /**
     * get all village resources
     */
    async getAll (req, res, next) {
        try
        {
            const villageResource = await VillageResourceService.getAll();
            res.status(200).json(villageResource);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a village resource by id
     */
    async get (req, res, next) {
        try
        {
            const villageResource = await VillageResourceService.getById(req.params.id);
            res.status(200).json(villageResource);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a village resource
     */
    async create (req, res, next) {
        try
        {
            const villageResource = await VillageResourceService.create(req.body);
            res.status(201).json(villageResource);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a village resource
     */ 
    async update (req, res, next) {
        try
        {
            const villageResource = await VillageResourceService.update(req.params.id, req.body);
            res.status(200).json(villageResource);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a village resource
     */
    async delete (req, res, next) {
        try
        {
            await VillageResourceService.delete(req.params.id);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new VillageResourceController();