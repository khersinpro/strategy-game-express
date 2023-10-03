const NotFoundError = require('../../errors/not-found');
const DefenseTypeService = require('./defense_type.service');
class DefenseTypeController {

    /**
     * Returns all defense types
     */
    async getAll (req, res, next) {
        try
        {
            const defenseTypes = await DefenseTypeService.getAll();
            res.status(200).json(defenseTypes);
        }
        catch (err)
        {
            next(err);
        }
    }

    /**
     * Returns all defense types for a specific unit
     * @throws {NotFoundError} if defense types not found
     */
    async getByUnitName (req, res, next) {
        try
        {
            const defenseTypes = await DefenseTypeService.getByUnitName(req.params.unitname);

            if (!defenseTypes.length)
            {
                throw new NotFoundError(`Defense types for unit ${req.params.unitname} not found`);
            }

            res.status(200).json(defenseTypes);
        }
        catch (err)
        {
            next(err);
        }
    }

    /**
     * Returns a defense type by unit name and type
     * @throws {NotFoundError} if defense type not found
     */ 
    async getByUnitNameAndType (req, res, next) {
        try
        {
            const defenseType = await DefenseTypeService.getByNameAndType(req.params.unitname, req.params.type);

            if (!defenseType)
            {
                throw new NotFoundError(`Defense type ${req.params.type} for unit ${req.params.unitname} not found`);
            }

            res.status(200).json(defenseType);
        }
        catch (err)
        {
            next(err);
        }
    }

    /**
     * Creates a new defense type and returns it
     */ 
    async create (req, res, next) {
        try
        {
            const defenseType = await DefenseTypeService.create(req.body);
            res.status(200).json(defenseType);
        }
        catch (err)
        {
            next(err);
        }
    }

    /**
     * Update a defense type
     */ 
    async update (req, res, next) {
        try
        {
            const defenseType = await DefenseTypeService.update(req.params.unitname, req.params.type, req.body);
            res.status(200).json(defenseType);
        }
        catch (err)
        {
            next(err);
        }
    }

    /**
     * Delete a defense type
     */
    async delete (req, res, next) {
        try
        {
            const defenseType = await DefenseTypeService.delete(req.params.unitname, req.params.type);
            res.status(200).json(defenseType);
        }
        catch (err)
        {
            next(err);
        }
    }
}

module.exports = new DefenseTypeController();