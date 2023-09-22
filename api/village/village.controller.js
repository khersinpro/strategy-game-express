const NotFoundError = require('../../errors/not-found');
const VillageService = require('./village.service');

class VillageController {

    /**
     * Returns all villages
     */
    async getAll(req, res, next) {
        try {
            const villages = await VillageService.getAll();
            res.status(200).send(villages);
        }
        catch (error) 
        {
            next(error);
        }    
    }

    /**
     * Find a village by id and returns it
     * @throws {NotFoundError} if the village does not exist
     */
    async get(req, res, next) {
        try 
        {
            const village = await VillageService.getById(req.params.id);    

            if (!village)
            {
                throw new NotFoundError(`Village with id ${req.params.id} not found`);
            }

            res.status(200).send(village);
        }
        catch (error)
        {
            next(error);
        }
    }

    /** 
     * Creates a new village and returns it
     */ 
    async create(req, res, next) {
        try 
        {
            const village = await VillageService.create(req.body);
            res.status(201).send(village);
        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Updates a village
     */ 
    async update(req, res, next) {
        try 
        {
            const village = await VillageService.update(req.params.id, req.body);
            res.status(200).send(village);
        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Deletes a village
     */ 
    async delete(req, res, next) {
        try 
        {
            const village = await VillageService.delete(req.params.id);
            res.status(200).send(village);
        }
        catch (error)
        {
            next(error);
        }
    }
}

module.exports = new VillageController();