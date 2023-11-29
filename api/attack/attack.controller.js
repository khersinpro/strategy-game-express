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

    // /**
    //  * @description Simulate an attack
    //  * @param {Number}  req.query.attack_unit_1 - the quantity of unit 1
    //  * @param {Number}  req.query.attack_unit_2 - the quantity of unit 2
    //  * @param {Number}  req.query.attack_unit_3 - the quantity of unit 3
    //  * @param {Number}  req.query.defense_unit_1 - the quantity of unit 1
    //  * @param {Number}  req.query.defense_unit_2 - the quantity of unit 2
    //  * @param {Number}  req.query.defense_unit_3 - the quantity of unit 3
    //  * @param {Number}  req.query.village_id - the id of the village
    //  */
    // async attackSimulation(req, res, next) {
    //     try
    //     {
    //         console.log(req.query);
    //         const attack = await AttackService.generateIncomingAttackResults(req.query.village_id);
    //         res.status(200).json(attack);
    //     }
    //     catch(error)
    //     {
    //         next(error);
    //     }
    // }
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
            const results = {}
            const unit1 = {
                type: 'infantry',
                attack: 40,
                defense: {
                    infantry: 35,
                    cavalry: 50,
                    archer: 40
                }
            }
            console.log("je suis au debut");

            const unit2 = {
                type: 'cavalry',
                attack: 130,
                defense: {
                    infantry: 120,
                    cavalry: 100,
                    archer: 150
                }
            }

            const unit3 = {
                type: 'archer',
                attack: 60,
                defense: {
                    infantry: 40,
                    cavalry: 30,
                    archer: 50
                }
            }

            console.log(req.query);
            // Units of the attacker
            const attackUnit1 = req.query.attack_unit_1;
            const attackUnit2 = req.query.attack_unit_2;
            const attackUnit3 = req.query.attack_unit_3;

            results.attackUnit1 = attackUnit1;
            results.attackUnit2 = attackUnit2;
            results.attackUnit3 = attackUnit3;

            // Units of the defender
            const defenseUnit1 = req.query.defense_unit_1;
            const defenseUnit2 = req.query.defense_unit_2;
            const defenseUnit3 = req.query.defense_unit_3;

            results.defenseUnit1 = defenseUnit1;
            results.defenseUnit2 = defenseUnit2;
            results.defenseUnit3 = defenseUnit3;

            // Calculer la part de chaque type d'arme (infantry, cavalry, et archer) dans l'attaque. 
            const totalAttackInfantry = attackUnit1 * unit1.attack;
            const totalAttackCavalry = attackUnit2 * unit2.attack;
            const totalAttackArcher = attackUnit3 * unit3.attack;

            results.totalAttackInfantry = totalAttackInfantry;
            results.totalAttackCavalry = totalAttackCavalry;
            results.totalAttackArcher = totalAttackArcher;

            // La défense s'organisera en effet en conséquence : si l'attaque est constituée, selon les points d'attaque, 
            // de 30% d'attaque infantry, 
            // 20% d'attaque de cavalry et de 50% d'attaque archer, 
            // 30% des unités du défenseur iront se combattre contre les attaques infantry, 20% contre les attaques cavalry , et 50% contre les archer.
            const totalDefenseInfantry = (defenseUnit1 * unit1.defense.infantry) + (defenseUnit2 * unit2.defense.infantry) + (defenseUnit3 * unit3.defense.infantry);
            const totalDefenseCavalry = (defenseUnit1 * unit1.defense.cavalry) + (defenseUnit2 * unit2.defense.cavalry) + (defenseUnit3 * unit3.defense.cavalry);
            const totalDefenseArcher = (defenseUnit1 * unit1.defense.archer) + (defenseUnit2 * unit2.defense.archer) + (defenseUnit3 * unit3.defense.archer);

            results.totalDefenseInfantry = totalDefenseInfantry;
            results.totalDefenseCavalry = totalDefenseCavalry;
            results.totalDefenseArcher = totalDefenseArcher;

            const allocationInfantry = totalAttackInfantry / (totalAttackInfantry + totalAttackCavalry + totalAttackArcher);
            const allocationCavalry = totalAttackCavalry / (totalAttackInfantry + totalAttackCavalry + totalAttackArcher);
            const allocationArcher = totalAttackArcher / (totalAttackInfantry + totalAttackCavalry + totalAttackArcher);

            results.allocationInfantry = allocationInfantry;
            results.allocationCavalry = allocationCavalry;
            results.allocationArcher = allocationArcher;

            // units defense allocations attack infantry = 30% so get 30% of each defense unit
            const defenseUnit1Infantry = defenseUnit1 * allocationInfantry;
            const defenseUnit2Infantry = defenseUnit2 * allocationInfantry;
            const defenseUnit3Infantry = defenseUnit3 * allocationInfantry;

            results.defenseUnit1Infantry = defenseUnit1Infantry;
            results.defenseUnit2Infantry = defenseUnit2Infantry;
            results.defenseUnit3Infantry = defenseUnit3Infantry;

            // units defense allocations attack cavalry = 20% so get 20% of each defense unit
            const defenseUnit1Cavalry = defenseUnit1 * allocationCavalry;
            const defenseUnit2Cavalry = defenseUnit2 * allocationCavalry;
            const defenseUnit3Cavalry = defenseUnit3 * allocationCavalry;

            results.defenseUnit1Cavalry = defenseUnit1Cavalry;
            results.defenseUnit2Cavalry = defenseUnit2Cavalry;
            results.defenseUnit3Cavalry = defenseUnit3Cavalry;

            // units defense allocations attack archer = 50% so get 50% of each defense unit
            const defenseUnit1Archer = defenseUnit1 * allocationArcher;
            const defenseUnit2Archer = defenseUnit2 * allocationArcher;
            const defenseUnit3Archer = defenseUnit3 * allocationArcher;

            results.defenseUnit1Archer = defenseUnit1Archer;
            results.defenseUnit2Archer = defenseUnit2Archer;
            results.defenseUnit3Archer = defenseUnit3Archer;

            // Round 1 : Infantry
            const totalDefenseQuantityRound1 = defenseUnit1Infantry + defenseUnit2Infantry + defenseUnit3Infantry;
            const totalDefenseInfantryRound1 = (defenseUnit1Infantry * unit1.defense.infantry) +( defenseUnit2Infantry * unit2.defense.infantry) +( defenseUnit3Infantry * unit3.defense.infantry);
            
            const totalAttackInfantryAfterRound1 = totalAttackInfantry - totalDefenseInfantryRound1;
            const totalDefenseInfantryAfterRound1 = totalDefenseInfantryRound1 - totalAttackInfantry;
    
        
            const attackInfantryAlivePercent    = totalAttackInfantryAfterRound1 / totalAttackInfantry;
            const infantryAlive = totalAttackInfantryAfterRound1 > 0 ? Math.round(attackInfantryAlivePercent * attackUnit1) : 0;

            const totalDefenseInfantryRound1AlivePercent = totalDefenseInfantryAfterRound1 / totalDefenseInfantryRound1;
            const totalDefenseInfantryRound1Alive = totalDefenseInfantryAfterRound1 > 0 ? Math.round(totalDefenseQuantityRound1 * totalDefenseInfantryRound1AlivePercent) : 0;

            results.infantryRound1Stats = {
                attack: totalAttackInfantry,
                defense: totalDefenseInfantryRound1,
                remainingAttack: totalAttackInfantryAfterRound1,
                winner: totalAttackInfantryAfterRound1 > 0 ? 'attacker' : 'defender',
                defense_unit_total: totalDefenseQuantityRound1,
                defense_unit_alive: totalDefenseInfantryRound1Alive,
                attac_infantry_total: attackUnit1,
                attack_infantry_alive: infantryAlive,
            }





        // Return the results
        res.json({
            results,
        });



        }
        catch(error)
        {
            next(error);
        }
    }

}

module.exports = new AttackController();