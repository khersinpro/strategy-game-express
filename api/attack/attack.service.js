const { Op } = require('sequelize');
const { sequelize } = require('../../database/index');
const attack = require('../../database/models/attack');
const BadRequestError = require('../../errors/bad-request');
const NotFoundError = require('../../errors/not-found');
const { 
    Attack, 
    Village_unit, 
    Unit, 
    Attack_unit, 
    Map_position, 
    Village, 
    Wall_defense, 
    Village_building, 
    Defense_type 
} = require('../../database/index').models;

class AttackService {
    /**
     * Returns all attacks
     * @returns {Promise<Attack[]>}
     */ 
    getAll() {
        return Attack.findAll();
    }

    /**
     * Returns attack by id
     * @param {Number} id - The attack id
     * @throws {NotFoundError} when attack not found
     * @returns {Promise<Attack>}
     */ 
    async getById(id) {
        try
        {
            const attack = await Attack.findByPk(id);

            if (!attack) 
            {
                throw new NotFoundError('Attack not found');
            }

            return attack;
        }
        catch(error)
        {
            throw new NotFoundError('Attack not found');
        }
    }

    /**
     * Create a attack
     * @param {Object} data - Data to create an attack
     * @returns {Promise<Attack>}
     */
    create(data) {
        return Attack.create(data);
    }

    /**
     * Update a attack
     * @param {Number} id - The attack id
     * @param {Object} data - Data to update an attack
     * @returns {Promise<Attack>}
     */
    update(id, data) {
        return Attack.update(data, {
            where: {
                id: id
            }
        });
    }

    /**
     * Delete an attack
     * @param {Number} id - The attack id
     * @throws {NotFoundError} when attack not found
     * @returns {Promise<Attack>}
     */
    async delete(id) {
        try
        {
            const attack = await this.getById(id);

            if (!attack) 
            {
                throw new NotFoundError('Attack not found');
            }

            return attack.destroy();
        }
        catch(error)
        {
            throw new NotFoundError('Attack not found');
        }
    }

    /**
     * Generate an attack with the data provided
     * @param {Object} data - Data to create an attack
     * @param {Number} data.attackedVillageId - The village id of the target
     * @param {Number} data.attackingVillageId - The village id of the attacker
     * @param {Array.<{id: Number, quantity: Number}>} data.villageUnits - The villageUnits of the attacker
     * @param {Number} data.villageUnits[].id - The id of the villageUnit
     * @param {Number} data.villageUnits[].quantity - The quantity of the villageUnit
     * @param {Object} currentUser - The current user
     * @throws {NotFoundError} - When the resource is not found
     * @throws {BadRequestError} - When the request is not valid
     * @returns {Promise<Attack>}
     */ 
    async generate(data, currentUser) {
        const transaction = await sequelize.transaction();
        try
        {
            const attackedVillage  = await Village.findByPk(data.attackedVillageId, {
                include: [
                    {
                        model: Map_position,
                        required: true
                    }
                ]
            });

            const attackingVillage = await Village.findByPk(data.attackingVillageId, {
                include: [
                    {
                        model: Map_position,
                        required: true
                    }
                ]
            });

            attackingVillage.isAdminOrVillageOwner(currentUser);

            if (!attackedVillage || !attackingVillage) 
            {
                throw new NotFoundError('Village not found');
            }
            else if (attackedVillage.user_id === attackingVillage.user_id)
            {
                throw new BadRequestError('You cannot attack your own village');
            }
            else if (attackedVillage.id === attackingVillage.id)
            {
                throw new BadRequestError('You cannot attack your own village');
            }
            else if (data.villageUnits.length === 0 || !data.villageUnits)
            {
                throw new BadRequestError('You cannot attack without units');
            }

            // Create the attack with the status pending
            const attack = await this.create({
                attacked_village_id: attackedVillage.id,
                attacking_village_id: attackingVillage.id,
                attack_status: 'pending',
                departure_date: new Date(),
                arrival_date: new Date() 
            });

            const sameVillageUnits = data.villageUnits.filter(villageUnit => villageUnit.id === attackedVillage.id);

            if (sameVillageUnits.length > 0)
            {
                throw new BadRequestError('You cannot add same units in the same attack');
            }

            let slowestUnitSpeed = 0;
            for (const villageUnit of data.villageUnits) 
            {
                const villageUnitData = await Village_unit.findOne({
                    include: [
                        {
                            model: Unit,
                            required: true
                        }
                    ],
                    where: {
                        id: villageUnit.id,
                        village_id: attackingVillage.id
                    }
                });

                if (!villageUnitData) 
                {
                    throw new NotFoundError('Village unit not found');
                }

                if (villageUnitData.present_quantity < villageUnit.quantity)
                {
                    throw new BadRequestError('You cannot attack with more units than you have');
                }

                if (slowestUnitSpeed < villageUnitData.Unit.movement_speed)
                {
                    slowestUnitSpeed = villageUnitData.Unit.movement_speed;
                }

                await Attack_unit.create({
                    attack_id: attack.id,
                    village_unit_id: villageUnit.id,
                    sent_quantity: villageUnit.quantity
                },);

                await villageUnitData.update({
                    present_quantity: villageUnitData.present_quantity - villageUnit.quantity,
                    in_attack_quantity: villageUnitData.in_attack_quantity + villageUnit.quantity
                }, { transaction });
            }

            if (slowestUnitSpeed === 0)
            {
                throw new Error('Unit speed cannot be 0.');
            }

            // calculate the distance between the two villages 
            const attackingVillageXPosition = attackingVillage.Map_position.x;
            const attackingVillageYPosition = attackingVillage.Map_position.y;
            const attackedVillageXPosition  = attackedVillage.Map_position.x;
            const attackedVillageYPosition  = attackedVillage.Map_position.y;
            const distance                  = this.euclideanDistance(attackingVillageXPosition, attackingVillageYPosition, attackedVillageXPosition, attackedVillageYPosition);
            const estimatedTravelTime       = this.estimateTravelTime(distance, slowestUnitSpeed);
            const arrivalTime               = this.calculateArrivalTime(attack.departure_date, estimatedTravelTime);
            attack.arrival_date             = arrivalTime;
            attack.attack_status            = 'attacking';
            await attack.save();
            
            // Control if the date is saved correctly
            if (attack.arrival_date < new Date() || attack.arrival_date !== arrivalTime || attack.attack_status !== 'attacking')
            {
                await attack.destroy()
                throw new Error('Invalid arrival date or attack status.');
            }
            
            await transaction.commit();
            return attack;
        }
        catch (error)
        {
            transaction.rollback();
            throw error;
        }
    }
    /**
     * Calculate the incoming attack results
     * @param {Number} villageId - The village id where the attack is incoming
     */
    async generateIncomingAttackResults(villageId) {
        try 
        {
            const attackReport = {

            }

            const incomingAttacks = await Attack.findAll({
                include: [
                    {
                        model: Attack_unit,
                        required: true,
                        include: [
                            {
                                model: Village_unit,
                                required: true,
                                include: [
                                    {
                                        model: Unit,
                                        required: true,
                                    }
                                ]
                            }
                        ]
                    }
                ],
                where: {
                    attacked_village_id: villageId,
                    attack_status: 'attacking',
                    arrival_date: {
                        [Op.lt]: new Date()
                    }
                }
            });

            if (!incomingAttacks)
            {
                return;
            }

            const attackedVillage = await Village.findByPk(villageId);

            if (!attackedVillage)
            {
                throw new NotFoundError('Village not found');
            }

            let wallDefenseIncrease = 0;
            const attackedVillageWall = await Village_building.findOne({
                where: {
                    village_id: attackedVillage.id, 
                    type: 'wall_building'
                }
            });

            if (attackedVillageWall)
            {
                const wallDefenseLevel = attackedVillageWall.level_id;

                const wallDefense = await Wall_defense.findOne({
                    where: {
                        building_level_id: wallDefenseLevel
                    }
                });

                if (wallDefense)
                {
                    wallDefenseIncrease = wallDefense.defense_percent;
                }
            }

            for (const incomingAttack of incomingAttacks)
            {
                // update the village resourse with the incoming attack date
                // update the village units with the incoming attack date
                const incomingAttackUnits = incomingAttack.Attack_units;
                const attackUnitQuantity = incomingAttackUnits.reduce((quantity, attackUnit) => {

                    if (quantity[attackUnit.Village_unit.Unit.unit_type] === undefined) {
                        quantity[attackUnit.Village_unit.Unit.unit_type] = 0;
                    }
                    quantity[attackUnit.Village_unit.Unit.unit_type] += attackUnit.sent_quantity;
                    quantity.totalQuantity += attackUnit.sent_quantity;
                    return quantity;
                }, {totalQuantity: 0});

                const attackPowerStats    = incomingAttackUnits.reduce((attackStats, attackUnit) => {
                    if (attackStats[attackUnit.Village_unit.Unit.unit_type] === undefined)
                    {
                        attackStats[attackUnit.Village_unit.Unit.unit_type] = 0;
                    }
                    attackStats[attackUnit.Village_unit.Unit.unit_type] += attackUnit.sent_quantity * attackUnit.Village_unit.Unit.attack;
                    attackStats.totalAttack += attackUnit.sent_quantity * attackUnit.Village_unit.Unit.attack;
                    return attackStats;
                }, {totalAttack: 0});

                attackReport.attackPowerTotal = attackPowerStats;
                attackReport.attackUnitQuantity = attackUnitQuantity;

                const defenseAttackUnits = await Village_unit.findAll({ 
                    include: [
                        {
                            model: Unit,
                            required: true,
                            include: [
                                {
                                    model: Defense_type,
                                    required: true
                                }
                            ]
                        }
                    ],
                    where: {
                        village_id: attackedVillage.id,
                        present_quantity: {
                            [Op.gt]: 0
                        }
                    }
                });

                const defenseUnitQuantity = defenseAttackUnits.reduce((quantity, defenseUnit) => {
                    if (quantity[defenseUnit.Unit.unit_type] === undefined) {
                        quantity[defenseUnit.Unit.unit_type] = 0;
                    }
                    quantity[defenseUnit.Unit.unit_type] += defenseUnit.present_quantity;
                    quantity.totalQuantity               += defenseUnit.present_quantity;
                    return quantity;
                }, {totalQuantity: 0});

                const defensePowerStats  = defenseAttackUnits.reduce((defenseStats, defenseUnit) => {
                    const defenses = defenseUnit.Unit.Defense_types;
                    for (const defense of defenses)
                    {
                        if (defenseStats[defense.type] === undefined)
                        {
                            defenseStats[defense.type] = 0;
                        }
                        defenseStats[defense.type] += defenseUnit.present_quantity * defense.defense_value;
                        defenseStats.totalDefense  += defenseUnit.present_quantity * defense.defense_value;
                    }
                    return defenseStats;
                }, {totalDefense: 0});


                attackReport.defensePowerTotal = defensePowerStats;
                attackReport.defenseUnitQuantity = defenseUnitQuantity;


                const attackPower               = attackPowerStats.totalAttack;
                const defensePowerWithoutWall   = defensePowerStats.totalDefense;
                const defensePower              = defensePowerWithoutWall + (defensePowerWithoutWall * (wallDefenseIncrease / 100));
                let attackWin                   = attackPower > defensePower;
                let battleRatio                 = 0;

                attackReport.attackWin = attackWin;
                attackReport.defensePowerWithoutWall = defensePowerWithoutWall;
                attackReport.defensePower = defensePower;
                attackReport.attackPower = attackPower;

                if (attackWin)
                {
                    battleRatio = Math.pow((defensePower / attackPower), 1.5) * 100;  
                }
                else if (!attackWin)
                {
                    battleRatio = Math.pow((attackPower / defensePower), 1.5) * 100;
                }
                else 
                {
                    battleRatio = 100;
                }

                attackReport.battleRatio = battleRatio;

                // ATTACK UNITS
                for (const attackUnit of incomingAttackUnits) 
                {
                    const aliveQuantity = attackWin ? Math.round(attackUnit.sent_quantity * (1 - battleRatio / 100)) : 0;
                    const lostQuantity  = attackWin ? attackUnit.sent_quantity - aliveQuantity : attackUnit.sent_quantity;
                    attackUnit.lost_quantity = lostQuantity;
                    await attackUnit.save();

                    const villageUnit = await Village_unit.findByPk(attackUnit.village_unit_id);
                    villageUnit.in_attack_quantity -= attackUnit.lost_quantity;
                    villageUnit.total_quantity -= attackUnit.lost_quantity;
                    await villageUnit.save();
                }

                // DEFENSE UNITS
                for (const defenseUnit of defenseAttackUnits)
                {
                    const aliveQuantity = !attackWin ? Math.round(defenseUnit.present_quantity * (1 - battleRatio / 100)) : 0;
                    const lostQuantity  = !attackWin ? defenseUnit.present_quantity - aliveQuantity : defenseUnit.present_quantity;
                    const villageUnit = await Village_unit.findByPk(defenseUnit.id);
                    villageUnit.present_quantity -= lostQuantity;
                    villageUnit.total_quantity   -= lostQuantity;
                    await villageUnit.save();
                }

                incomingAttack.attack_status = attackWin ? 'returning' : 'lost';
                const attackTravelDuration   = incomingAttack.arrival_date - incomingAttack.departure_date;
                incomingAttack.return_date   = attackWin ? new Date(incomingAttack.arrival_date.getTime() + attackTravelDuration) : null;
                await incomingAttack.save();
            }

            return attackReport;
                
        }
        catch (error)
        {
            throw error;
        }
    }

    /**
     * Calculate the outgoing attack results
     * @param {Number} attack - The attack
     */
    generateOutgoingAttackResults(attack) {
        try 
        {

        }
        catch (error)
        {

        }
    }

    calculateDefensePower (villageUnits) {
        let defensePower = 0;

        for (const villageUnit of villageUnits)
        {
            defensePower += villageUnit.present_quantity * villageUnit.Unit.defense;
        }

        return defensePower;
    }



    /**
     * Calcule the distance between two villages
     * @param {Number} x1 - The x position of the first village
     * @param {Number} y1 - The y position of the first village
     * @param {Number} x2 - The x position of the second village
     * @param {Number} y2 - The y position of the second village
     * @returns {Number} - The distance between the two villages 
     */
    euclideanDistance(x1, y1, x2, y2) {
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        return distance;
    }

    /**
     * Calcule the estimated travel time with the slowest unit speed
     * @param {Number} distance - The distance between the two villages
     * @param {Number} speed - The slowest unit speed
     * @returns - The estimated travel time
     */
    estimateTravelTime(distance, speed) {
        const travelTime = distance / speed;
        return travelTime;
    }

    /**
     * Calcule the arrival time
     * @param {Date} currentDateTime - The current date and time
     * @param {Number} estimatedTravelTime - The estimated travel time
     * @returns - The arrival time
     */
    calculateArrivalTime(currentDateTime, estimatedTravelTime) {
        // Parse the current date and time string to a Date object
        const startDate = new Date(currentDateTime);
      
        // Calculate the arrival time by adding the estimated travel time (in hours) to the start date
        const arrivalTime = new Date(startDate.getTime() + estimatedTravelTime * 60 * 60 * 1000); // Convert hours to milliseconds
      
        return arrivalTime;
    }
}

module.exports = new AttackService();