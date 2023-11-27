const { sequelize } = require('../../database/index');
const attack = require('../../database/models/attack');
const BadRequestError = require('../../errors/bad-request');
const NotFoundError = require('../../errors/not-found');
const { 
    Attack, 
    Village_unit, 
    Unit, 
    Attack_unit, 
    Map_position, Village, 
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
            const incomingAttacks = await Attack.findAll({
                includes: [
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

            const attackedVillage = await Village.findByPk(villageId, {
                include: [
                    {
                        model: Village_unit,
                        where: {
                            present_quantity: {
                                [Op.gt] : 0
                            }
                        },
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
                        ]
                    },
                    {
                        model: Village_building,
                        where: {
                            type: 'wall_building'
                        }
                    }
                ] 
            });

            if (!attackedVillage)
            {
                throw new NotFoundError('Village not found');
            }

            let wallDefenseIncrease = 0;

            if (attackedVillage.village_buildings.length > 0 && attackedVillage.village_buildings[0].level_id)
            {
                const wallDefenseLevel = attackedVillage.village_buildings[0].level_id;

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
                const attackPowerStats    = incomingAttackUnits.reduce((attackStats, attackUnit) => {
                    if (attackStats[attackUnit.Village_unit.Unit.attack_type] === undefined)
                    {
                        attackStats[attackUnit.Village_unit.Unit.attack_type] = 0;
                    }
                    attackStats[attackUnit.Village_unit.Unit.attack_type] += attackUnit.sent_quantity * attackUnit.Village_unit.Unit.attack;
                    return attackStats;
                }, {});


                const defenseAttackUnits = attackedVillage.Village_units || [];
                const defensePowerStats  = defenseAttackUnits.reduce((defenseStats, defenseUnit) => {
                    const defenses = defenseUnit.Unit.Defense_types;
                    for (const defense of defenses)
                    {
                        if (defenseStats[defense.type] === undefined)
                        {
                            defenseStats[defense.type] = 0;
                        }
                        defenseStats[defense.type] += defenseUnit.present_quantity * defense.defense;
                    }
                    return defenseStats;
                }, {});



            }
                
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