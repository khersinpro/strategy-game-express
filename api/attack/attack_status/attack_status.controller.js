const AttackStatusService = require('./attack_status.service');

class AttackStatusController {
    /**
     * Returns all attack status
     */ 
    async getAll(req, res, next) {
        try
        {
            const attackStatus = await AttackStatusService.getAll();
            res.json(attackStatus);
        }
        catch(error)
        {
            next(error);
        }
    }

    /**
     * Returns attack status by name
     * @param {String} req.params.name - The attack status name
     */ 
    async get(req, res, next) {
        try
        {
            const attackStatus = await AttackStatusService.getByName(req.params.name);
            res.json(attackStatus);
        }
        catch(error)
        {
            next(error);
        }
    }

    /**
     * Create a attack status
     * @param {Object} req.body - Data to create an attack status
     */ 
    async create(req, res, next) {
        try
        {
            const attackStatus = await AttackStatusService.create(req.body);
            res.json(attackStatus);
        }
        catch(error)
        {
            next(error);
        }
    }

    /**
     * Update a attack status
     * @param {String} req.params.name - The attack status name
     * @param {Object} req.body - Data to update an attack status
     */
    async update(req, res, next) {
        try
        {
            const attackStatus = await AttackStatusService.update(req.params.name, req.body);
            res.json(attackStatus);
        }
        catch(error)
        {
            next(error);
        }
    }

    /**
     * Delete an attack status
     * @param {String} req.params.name - The attack status name
     */
    async delete(req, res, next) {
        try
        {
            const attackStatus = await AttackStatusService.delete(req.params.name);
            res.json(attackStatus);
        }
        catch(error)
        {
            next(error);
        }
    }
}

module.exports = new AttackStatusController();