const NotFoundError = require('../../errors/not-found');
const UnitService = require('./unit.service');

class UnitController {

    /**
     * Returns all units
     */ 
    async getAll(req, res, next) {
        try 
        {
            const units = await UnitService.getAll(req.query.limit, req.query.page);
            res.status(200).json(units);
        }
        catch (error) 
        {
            next(error);
        }
    }

    /**
     * Returns a unit by name
     */
    async get(req, res, next) {
        try 
        {
            const unit = await UnitService.getByName(req.params.name);

            if (!unit)
            {
                throw new NotFoundError(`Unit with name ${req.params.name} not found`);
            }
            
            res.status(200).json(unit);
        }
        catch (error) 
        {
            next(error);
        }
    }

    /**
     * Creates a new unit
     */
    async create(req, res, next) {
        try 
        {
            const unit = await UnitService.create(req.body);
            res.status(201).json(unit);
        }
        catch (error) 
        {
            next(error);
        }
    }

    /**
     * Updates a unit
     */
    async update(req, res, next) {
        try 
        {
            const unit = await UnitService.update(req.params.name, req.body);
            res.status(200).json(unit);
        }
        catch (error) 
        {
            next(error);
        }
    }

    /**
     * Deletes a unit
     */
    async delete(req, res, next) {
        try 
        {
            await UnitService.delete(req.params.name);
            res.status(204).end();
        }
        catch (error) 
        {
            next(error);
        }
    }
}

module.exports = new UnitController();