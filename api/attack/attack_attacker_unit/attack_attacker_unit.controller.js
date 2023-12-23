const AttackUnitService = require('./attack_attacker_unit.service');

class AttackAttackerUnitController {
    /**
     * Returns all attack units
     */ 
    async getAll(req, res, next) {
        try
        {
            const attackUnits = await AttackUnitService.getAll();
            res.status(200).json(attackUnits);
        }
        catch(error)
        {
            next(error);
        }
    }

    /**
     * Returns attack unit by id
     * @param {Number} req.params.id - The attack unit id 
     */ 
    async getById(req, res, next) {
        try
        {
            const attackUnit = await AttackUnitService.getById(req.params.id);
            res.status(200).json(attackUnit);
        }
        catch(error)
        {
            next(error);
        }
    }

    /**
     * Create a attack unit
     * @param {Object} req.body - Data to create an attack unit
     */  
    async create(req, res, next) {
        try
        {
            const attackUnit = await AttackUnitService.create(req.body);
            res.status(201).json(attackUnit);
        }
        catch(error)
        {
            next(error);
        }
    }

    /**
     * Update a attack unit
     * @param {Number} req.params.id - The attack unit id
     * @param {Object} req.body - Data to update an attack unit
     */
    async update(req, res, next) {
        try
        {
            const attackUnit = await AttackUnitService.update(req.params.id, req.body);
            res.status(200).json(attackUnit);
        }
        catch(error)
        {
            next(error);
        }
    }

    /**
     * Delete an attack unit
     * @param {Number} req.params.id - The attack unit id
     */
    async delete(req, res, next) {
        try
        {
            const attackUnit = await AttackUnitService.delete(req.params.id);
            res.status(200).json(attackUnit);
        }
        catch(error)
        {
            next(error);
        }
    }
}

module.exports = new AttackAttackerUnitController();