const unit = require('../../database/models/unit');
const BadRequestError = require('../../errors/bad-request');
const NotFoundError = require('../../errors/not-found');
const AttackService = require('./attack.service');
const {Unit, Defense_type, Wall_defense} = require('../../database/index').models;

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
            return res.json('ok')
            const attack = await AttackService.generate(req.body, req.user);
            res.status(200).json(attack);
        }
        catch(error)
        {
            next(error);
        }
    }

    async handleIncommingAttacks(req, res, next) {
        try
        {
            const attacks = await AttackService.handleIncommingAttacks(req.params.id);
            res.status(200).json(attacks);
        }
        catch(error)
        {
            next(error);
        }
    }

    /**
     * @description Simulate an attack
     * @param {Object} req.body - Object containing the attack data
     * @param {Object[]} req.body.attack_units - Object containing the id and quantity of each unit
     * @param {Object[]} req.body.defense_units - Object containing the id and quantity of each unit
     * @param {Object} req.body.wall - Object containing the level of the wall 
     */
    async attackSimulation(req, res, next) {
        try
        {
            const {attack_units, defense_units, wall} = req.body;
            const simulation = await AttackService.attackSimulation(attack_units, defense_units, wall);
            res.status(200).json(simulation);
        }
        catch(error)
        {
            next(error);
        }
    }

}

module.exports = new AttackController();