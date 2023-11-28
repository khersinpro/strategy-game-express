const AttackService = require('./attack.service');

class AttackController {

    async getAll(req, res, next) {
        try
        {
            const attacks = await AttackService.getAll();
            res.status(200).json(attacks);
        }
        catch(error)
        {
            next(error);
        }
    }

    async getById(req, res, next) {
        try
        {
            const attack = await AttackService.getById(req.params.id);
            res.status(200).json(attack);
        }
        catch(error)
        {
            next(error);
        }
    }

    async create(req, res, next) {
        try
        {
            const attack = await AttackService.create(req.body);
            res.status(201).json(attack);
        }
        catch(error)
        {
            next(error);
        }
    }

    async update(req, res, next) {
        try
        {
            const attack = await AttackService.update(req.params.id, req.body);
            res.status(200).json(attack);
        }
        catch(error)
        {
            next(error);
        }
    }

    async delete(req, res, next) {
        try
        {
            const attack = await AttackService.delete(req.params.id);
            res.status(200).json(attack);
        }
        catch(error)
        {
            next(error);
        }
    }

    async generate(req, res, next) {
        try
        {
            const attack = await AttackService.generate(req.body, req.user);
            res.status(200).json(attack);
        }
        catch(error)
        {
            next(error);
        }
    }

    /**
     * @description Simulate an attack
     * @param {Number}  req.query.attack_unit_1 - the quantity of unit 1
     * @param {Number}  req.query.attack_unit_2 - the quantity of unit 2
     * @param {Number}  req.query.attack_unit_3 - the quantity of unit 3
     * @param {Number}  req.query.defense_unit_1 - the quantity of unit 1
     * @param {Number}  req.query.defense_unit_2 - the quantity of unit 2
     * @param {Number}  req.query.defense_unit_3 - the quantity of unit 3
     * @param {Number}  req.query.village_id - the id of the village
     */
    async attackSimulation(req, res, next) {
        try
        {
            console.log(req.query);
            const attack = await AttackService.generateIncomingAttackResults(req.query.village_id);
            res.status(200).json(attack);
        }
        catch(error)
        {
            next(error);
        }
    }

}

module.exports = new AttackController();