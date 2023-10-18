const WallDefenseService = require('./building_level.service');

class WallDefenseController {
    
    /**
     * get all wall defenses
     */
    async getAll (req, res, next) {
        try
        {
            const wallDefenses = await WallDefenseService.getAll();
            res.status(200).json(wallDefenses);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a wall defense by id
     */
    async get (req, res, next) {
        try
        {
            const wallDefense = await WallDefenseService.getById(req.params.id);
            res.status(200).json(wallDefense);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a wall defense
     */
    async create (req, res, next) {
        try
        {
            const wallDefense = await WallDefenseService.create(req.body);
            res.status(201).json(wallDefense);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a wall defense
     */ 
    async update (req, res, next) {
        try
        {
            const wallDefense = await WallDefenseService.update(req.params.id, req.body);
            res.status(200).json(wallDefense);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a wall defense
     */
    async delete (req, res, next) {
        try
        {
            await WallDefenseService.delete(req.params.id);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new WallDefenseController();