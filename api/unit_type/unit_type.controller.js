const UnitTypeService = require('./unit_type.service');

class UnitTypeController {

    /**
     * Returns all unitTypes
     */ 
    async getAll(req, res, next) {
        try 
        {
            const unitTypes = await UnitTypeService.getAll();
            res.status(200).json(unitTypes);
        }
        catch (error) 
        {
            next(error);
        }
    }

    /**
     * Returns a unitType by type
     */
    async get(req, res, next) {
        try 
        {
            const unitType = await UnitTypeService.getByType(req.params.type);
            res.status(200).json(unitType);
        }
        catch (error) 
        {
            next(error);
        }
    }

    /**
     * Creates a new unitType
     */
    async create(req, res, next) {
        try 
        {
            const unitType = await UnitTypeService.create(req.body);
            res.status(201).json(unitType);
        }
        catch (error) 
        {
            next(error);
        }
    }

    /**
     * Updates a unitType
     */
    async update(req, res, next) {
        try 
        {
            const unitType = await UnitTypeService.update(req.params.type, req.body);
            res.status(200).json(unitType);
        }
        catch (error) 
        {
            next(error);
        }
    }

    /**
     * Deletes a unitType
     */
    async delete(req, res, next) {
        try 
        {
            await UnitTypeService.delete(req.params.type);
            res.status(204).end();
        }
        catch (error) 
        {
            next(error);
        }
    }
}

module.exports = new UnitTypeController();