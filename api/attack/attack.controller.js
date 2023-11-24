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
     */
    attackSimulation(req, res, next) {
        const unit_1 = {
            attack: 20,
            defense: {
                unit_1: 10,
                unit_2: 20,
                unit_3: 30
            }
        };
        const unit_2 = {
            attack: 30,
            defense: {
                unit_1: 20,
                unit_2: 10,
                unit_3: 20
            }
        };
        const unit_3 = {
            attack: 10,
            defense: {
                unit_1: 30,
                unit_2: 20,
                unit_3: 10
            }
        };

        const attack_unit_1 = req.query.attack_unit_1;
        const attack_unit_2 = req.query.attack_unit_2;
        const attack_unit_3 = req.query.attack_unit_3;  

        const defense_unit_1 = req.query.defense_unit_1;
        const defense_unit_2 = req.query.defense_unit_2;
        const defense_unit_3 = req.query.defense_unit_3;

        const totalAttackPower = (attack_unit_1 * unit_1.attack) + (attack_unit_2 * unit_2.attack) + (attack_unit_3 * unit_3.attack);
        // const unit1TotalAttackPower = attack_unit_1 * unit_1.attack;
        // const unit2TotalAttackPower = attack_unit_2 * unit_2.attack;
        // const unit3TotalAttackPower = attack_unit_3 * unit_3.attack;

        const totalDefensePower = (defense_unit_1 * unit_1.defense.unit_1) + (defense_unit_2 * unit_2.defense.unit_2) + (defense_unit_3 * unit_3.defense.unit_3);
        // const unit1TotalDefensePower = defense_unit_1 * unit_1.defense.unit_1;
        // const unit2TotalDefensePower = defense_unit_2 * unit_2.defense.unit_2;
        // const unit3TotalDefensePower = defense_unit_3 * unit_3.defense.unit_3;

        // const totalAttackPower = 1500
        // const totalDefensePower = 2500
        // Calculate defense losses
        // (Valeur totale de l’attaque / Valeur totale de la défense)^1,5 * 100% (5)
        let battleRatio
        if (totalDefensePower > totalAttackPower) {
            battleRatio = Math.pow((totalAttackPower / totalDefensePower), 1.5) * 100;
        } else {
            battleRatio = Math.pow((totalDefensePower / totalAttackPower), 1.5) * 100;            
        }
        // battleRatio = Math.pow((totalAttackPower / totalDefensePower), 1.5) * 100;
        let unit_1_atk_alive;
        let unit_2_atk_alive;
        let unit_3_atk_alive;
        let unit_1_def_alive;
        let unit_2_def_alive;
        let unit_3_def_alive;
        if (totalDefensePower < totalAttackPower) {
            // Attackers win
            unit_1_atk_alive = Math.round(attack_unit_1 * (1 - battleRatio / 100));
            unit_2_atk_alive = Math.round(attack_unit_2 * (1 - battleRatio / 100));
            unit_3_atk_alive = Math.round(attack_unit_3 * (1 - battleRatio / 100));
            unit_1_def_alive = 0;
            unit_2_def_alive = 0;
            unit_3_def_alive = 0;
        } else {
            // Defenders win
            unit_1_def_alive = Math.round(defense_unit_1 * (1 - battleRatio / 100));
            unit_2_def_alive = Math.round(defense_unit_2 * (1 - battleRatio / 100));
            unit_3_def_alive = Math.round(defense_unit_3 * (1 - battleRatio / 100));
            unit_1_atk_alive = 0;
            unit_2_atk_alive = 0;
            unit_3_atk_alive = 0;
        }
        
        const result = {
            totalAttackPower,
            totalDefensePower,
            battleRatio,
            unit_1_atk_alive,
            unit_2_atk_alive,
            unit_3_atk_alive,
            unit_1_def_alive,
            unit_2_def_alive,
            unit_3_def_alive,
        };


        res.status(200).json(result);
    }

}

module.exports = new AttackController();