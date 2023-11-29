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
            const objectOfUnits =  {};
            const attackUnitArray = [];
            const defenseUnitArray = [];
            let unit1 = {
                type: 'infantry',
                attack: 40,
                defense: {
                    infantry: 35,
                    cavalry: 50,
                    archer: 40
                }
            }

            let unit2 = {
                type: 'cavalry',
                attack: 130,
                defense: {
                    infantry: 120,
                    cavalry: 100,
                    archer: 150
                }
            }

            let unit3 = {
                type: 'archer',
                attack: 60,
                defense: {
                    infantry: 40,
                    cavalry: 30,
                    archer: 50
                }
            }

            objectOfUnits.unit1 = unit1;
            objectOfUnits.unit2 = unit2;
            objectOfUnits.unit3 = unit3;

            // Units of the attacker
            let attackUnit1 = {
                name: 'unit1',
                quantity: parseInt(req.query.attack_unit_1),
                type: 'infantry',
            };
            let attackUnit2 = {
                name: 'unit2',
                quantity: parseInt(req.query.attack_unit_2),
                type: 'cavalry',
            };
            let attackUnit3 = {
                name: 'unit3',
                quantity: parseInt(req.query.attack_unit_3),
                type: 'archer',
            };

            attackUnitArray.push(attackUnit1);
            attackUnitArray.push(attackUnit2);
            attackUnitArray.push(attackUnit3);

            results.attackUnit1 = attackUnit1;
            results.attackUnit2 = attackUnit2;
            results.attackUnit3 = attackUnit3;

            // Units of the defender
            let defenseUnit1 = {
                name: 'unit1',
                quantity: parseInt(req.query.defense_unit_1),
                type: 'infantry',
            };
            let defenseUnit2 = {
                name: 'unit2',
                quantity: parseInt(req.query.defense_unit_2),
                type: 'cavalry',
            };
            let defenseUnit3 = {
                name: 'unit3',
                quantity: parseInt(req.query.defense_unit_3),
                type: 'archer',
            };

            defenseUnitArray.push(defenseUnit1);
            defenseUnitArray.push(defenseUnit2);
            defenseUnitArray.push(defenseUnit3);

            results.defenseUnit1 = defenseUnit1;
            results.defenseUnit2 = defenseUnit2;
            results.defenseUnit3 = defenseUnit3;

            let winner = null;
            let round = 1;

            
            
            let attackerTypes = ['infantry', 'cavalry', 'archer'];

            while(winner === null)
            {
                const totalAttack = attackUnitArray.reduce((total, unit) => {
                    return total + (unit.quantity * objectOfUnits[unit.name].attack);
                }, 0);

                for (const type of attackerTypes) {
                    // total d'attaque du type d'arme en cours
                    const unitInAttack = attackUnitArray.reduce((total, unit) => {
                        if (unit.type === type && unit.quantity > 0) {
                            total.attack_power  += (unit.quantity * objectOfUnits[unit.name].attack);
                            total.sent_quantity += unit.quantity;
                            return total;
                        }
                        return total;
                    }, {attack_power: 0, sent_quantity: 0, alive_quantity: 0, lost_quantity: 0});


                    // pourcentage aloué au type d'arme en attaque en cours
                    const attackAlocationPercent = unitInAttack.attack_power / totalAttack;

                    // Récupération du pourcentage d'unité en défense pour contrer le type d'arme en cours
                    const unitInDefense = defenseUnitArray.reduce((total, unit) => {
                        if (unit.quantity > 0) {
                            const sent_quantity = Math.round(unit.quantity * attackAlocationPercent);
                            const base_defense  = sent_quantity * objectOfUnits[unit.name].defense[type];

                            total.units.push({
                                unit_name: unit.name,
                                sent_quantity: sent_quantity,
                                alive_quantity: 0,
                                lost_quantity: 0,
                                base_defense: base_defense,
                            });
                            total.total_defense            += base_defense;
                        }   
                        return total;
                    }, {total_defense: 0, units: []});

                    const attackPowerComparison  = unitInAttack.attack_power - unitInDefense.total_defense;
                    const attackUnitAlivePercent = attackPowerComparison / unitInAttack.attack_power;

                    const defensePowerComparison  = unitInDefense.total_defense - unitInAttack.attack_power;
                    const defenseUnitAlivePercent = defensePowerComparison / unitInDefense.total_defense;

                    unitInAttack.alive_quantity  =  attackPowerComparison > 0 ? Math.round(attackUnitAlivePercent * unitInAttack.sent_quantity) : 0;
                    unitInAttack.lost_quantity   = unitInAttack.sent_quantity - unitInAttack.alive_quantity;
                    attackUnitArray.find(attackUnit => attackUnit.type === type).quantity -= unitInAttack.lost_quantity;



                    unitInDefense.units.forEach(unit => {
                        unit.alive_quantity = defensePowerComparison > 0 ? Math.round(defenseUnitAlivePercent * unit.sent_quantity) : 0;
                        unit.lost_quantity  = unit.sent_quantity - unit.alive_quantity;
                        defenseUnitArray.find(defenseUnit => defenseUnit.name === unit.unit_name).quantity -= unit.lost_quantity;
                    });

                    results[`round_${round}`] = {
                        unitInAttack,
                        unitInDefense,
                    };

                    if (attackPowerComparison <= 0) {
                        attackerTypes.splice(attackerTypes.indexOf(type), 1);
                    }

                }
                
                if (attackUnitArray.every(unit => unit.quantity === 0)) {
                    winner = 'defender';
                    break;
                }
                else if (defenseUnitArray.every(unit => unit.quantity === 0)) {
                    winner = 'attacker';
                    break;
                }

                round++;
                if (round > 20) {
                    winner = 'draw';
                    break;
                }
            }

            // Return the results
            res.json({
                winner: winner,
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