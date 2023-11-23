const AttackUnitService = require('./attack_unit.service');

class AttackUnitController {

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

module.exports = new AttackUnitController();