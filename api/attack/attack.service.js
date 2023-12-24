const { Op } = require('sequelize');
const { sequelize } = require('../../database/index');
const BadRequestError = require('../../errors/bad-request');
const NotFoundError = require('../../errors/not-found');
const unit = require('../../database/models/unit');
const { 
    Map_position, 
    Unit, 
    Defense_type,
    Village, 
    Village_unit, 
    Village_support,
    Village_building, 
    Wall_defense, 
    Attack, 
    Attack_attacker_unit, 
    Attack_defenser_unit,
    Attack_defenser_support,
    Attack_stolen_resource,
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

            const sameVillageUnits = data.villageUnits.reduce((total, unit) => {
                if (total.key.includes(unit.id))
                {
                    total.hasSameKey = true;
                }
                else
                {
                    total.key.push(unit.id);
                }
                return total;
            }, {key: [], hasSameKey: false });

            if (sameVillageUnits.hasSameKey === true)
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

                await Attack_attacker_unit.create({
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
     * Rename to handle incoming attack
     * @param {Number} villageId - The village id where the attack is incoming
     */
    async handleIncommingAttacks(villageId) {
        const transaction = await sequelize.transaction();
        try 
        {
            const incomingAttacks = await Attack.findAll({
                include: [
                    {
                        model: Attack_attacker_unit,
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

            for (const incomingAttack of incomingAttacks)
            {
                // update the village resourse with the incoming attack date
                // update the village units with the incoming attack date
                // Mise a jour des batiments avec dates d'arrivée de l'attaque

                const attackingVillage  = await Village.findByPk(incomingAttack.attacking_village_id);

                const attackerTypes     = [];
                let winner              = null;
                let round               = 1;
                let defensePercentWall  = 0;

                // Get the unit of incoming attack
                const attackerUnits = incomingAttack.Attack_attacker_units;

                // Get the type of units in attack
                for (const attackUnit of attackerUnits)
                {
                    if (!attackerTypes.includes(attackUnit.Village_unit.Unit.unit_type))
                    {
                        attackerTypes.push(attackUnit.Village_unit.Unit.unit_type);
                    }
                }

                // Get the defense units of the attacked village
                const defenderUnits = await Village_unit.findAll({ 
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

                const defenseUnits = [];
                
                // Création des unité du village en défense lié a l'attaque ( utile pour le rapport de fin de combat)
                for (const defenderUnit of defenderUnits)
                {
                    const present_quantity = defenderUnit.present_quantity;
                    const defenseUnit = await Attack_defenser_unit.create({
                        sent_quantity: present_quantity,
                        lost_quantity: 0,
                        attack_id: incomingAttack.id,
                        village_unit_id: defenderUnit.id
                    });
                    // Add the défense to the defenseUnit for next steps
                    defenseUnit.Defense_types = defenderUnit.Unit.Defense_types;
                    defenseUnits.push(defenseUnit);
                }

                // Get the support units of the attacked village
                const defenderSupportUnits = await Village_support.findAll({
                    include: [
                        {
                            model: Village_unit,
                            required: true,
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
                        }
                    ],
                    where: {
                        supported_village_id: attackedVillage.id,
                        quantity: {
                            [Op.gt]: 0
                        }
                    }
                });

                // Création des unité en support du village en défense lié a l'attaque ( utile pour le rapport de fin de combat)
                for (const defenderSupportUnit of defenderSupportUnits)
                {
                    const present_quantity = defenderSupportUnit.quantity;
                    const defenseSupport = await Attack_defenser_support.create({
                        sent_quantity: present_quantity,
                        lost_quantity: 0,
                        attack_id: incomingAttack.id,
                        village_support_id: defenderSupportUnit.id,
                    });
                    // Add the défense to the defenseUnit for next steps
                    defenseSupport.village_unit_id = defenderSupportUnit.village_unit_id
                    defenseSupport.Defense_types = defenderSupportUnit.Village_unit.Unit.Defense_types;
                    defenseUnits.push(defenseSupport);
                }

                // Get the wall defense percent if the wall level is specified and set it to the defensePercentWall variable
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
                        defensePercentWall = wallDefense.defense_percent;
                    }
                }

                // if the attacked village has no units in defense, the attacker win
                if (defenseUnits.length === 0)
                {
                    winner = 'attacker';
                }

                while(winner === null)
                {
                    // Get the total attack power of the attacker
                    const roundTotalAtk = attackerUnits.reduce((total, unit) => {
                        const unitAtk       =  unit.Village_unit.Unit.attack;
                        const aliveQuantity = unit.sent_quantity - unit.lost_quantity;
                        const totalAtk      = aliveQuantity * unitAtk;
                        return total + totalAtk;
                    }, 0);
    
                    // Total of units in attack for the type of weapon in progress
                    for (const type of attackerTypes) 
                    {
                        const roundAtkUnits = attackerUnits.reduce((total, unit) => {
                            const unitType = unit.Village_unit.Unit.unit_type;
                            if (unitType === type && unit.sent_quantity > unit.lost_quantity) 
                            {
                                const unitAtk       =  unit.Village_unit.Unit.attack;
                                const aliveQuantity = unit.sent_quantity - unit.lost_quantity;
                                total.attack_power  += (aliveQuantity * unitAtk);
                                total.sent_quantity += aliveQuantity;
                            }
                            return total;
                        }, {attack_power: 0, sent_quantity: 0, alive_quantity: 0, lost_quantity: 0});

                        // Percentage of units in attack for the type of weapon in progress
                        const roundAtkAlocationPercent = roundAtkUnits.attack_power / roundTotalAtk;

                        // Total of units in defense for the type of weapon in progress
                        const roundDefUnits = defenseUnits.reduce((total, unit) => {
                            if (unit.sent_quantity > unit.lost_quantity) 
                            {
                                const aliveQuantity = unit.sent_quantity - unit.lost_quantity;
                                const sent_quantity = Math.round(aliveQuantity * roundAtkAlocationPercent);
                                const unit_defense  = unit.Defense_types.find(defense => defense.type === type);
                                const base_defense  = sent_quantity * unit_defense.defense_value;
                                total.units.push({
                                    unit_id: unit.village_unit_id,
                                    sent_quantity: sent_quantity,
                                    alive_quantity: 0,
                                    lost_quantity: 0,
                                    base_defense: base_defense,
                                });

                                total.total_defense += base_defense;
                            }   
                            return total;
                        }, {total_defense: 0, units: []});
    
                        // Attack and defense comparison with alive percent
                        const defWithWallBonus        = roundDefUnits.total_defense + (roundDefUnits.total_defense * defensePercentWall / 100);
                        const atkPowerComparison      = roundAtkUnits.attack_power - defWithWallBonus;
                        const atkUnitAlivePercent     = atkPowerComparison / roundAtkUnits.attack_power;
                        const defensePowerComparison  = defWithWallBonus - roundAtkUnits.attack_power;
                        const defenseUnitAlivePercent = defensePowerComparison / defWithWallBonus;
    
    
                        // Calculs of the number of units lost for the attacker 
                        roundAtkUnits.alive_quantity  =  atkPowerComparison > 0 ? Math.floor(atkUnitAlivePercent * roundAtkUnits.sent_quantity) : 0;
                        roundAtkUnits.lost_quantity   = roundAtkUnits.sent_quantity - roundAtkUnits.alive_quantity;
    
                        for (const attackUnit of attackerUnits) 
                        {
                            if (attackUnit.Village_unit.Unit.unit_type === type && attackUnit.sent_quantity > attackUnit.lost_quantity) 
                            {
                                const unitsAlive         = atkPowerComparison > 0 ? Math.floor(atkUnitAlivePercent * (attackUnit.sent_quantity - attackUnit.lost_quantity)) : 0;
                                const lostQuantity       = (attackUnit.sent_quantity - attackUnit.lost_quantity) - unitsAlive;
                                attackUnit.lost_quantity += lostQuantity;
                            }
                        }

                        // Calculs of the number of units lost for the defender
                        for (const defenseUnit of defenseUnits) 
                        {
                            if (defenseUnit.sent_quantity > defenseUnit.lost_quantity) 
                            {
                                const unitSent = roundDefUnits.units.find(unit => unit.unit_id === defenseUnit.village_unit_id);
                                unitSent.alive_quantity       = defensePowerComparison > 0 ? Math.floor(defenseUnitAlivePercent * unitSent.sent_quantity) : 0;
                                unitSent.lost_quantity        = unitSent.sent_quantity - unitSent.alive_quantity;
                                defenseUnit.lost_quantity  += unitSent.lost_quantity;
                            }
                        }

                        // Remove the type of weapon if the attack power is negative or equal to 0
                        if (atkPowerComparison <= 0) {
                            attackerTypes.splice(attackerTypes.indexOf(type), 1);
                        }
    
                    }
                    
                    // Check if there is a winner
                    if (attackerUnits.every(unit => unit.lost_quantity >= unit.sent_quantity)) 
                    {
                        winner = 'defender';
                        break;
                    }
                    else if (defenseUnits.every(unit => unit.lost_quantity >= unit.sent_quantity)) 
                    {
                        winner = 'attacker';
                        break;
                    }
    
                    round++;
                    if (round > 20) 
                    {
                        throw new Error('Too many rounds');
                    }
                }

                // Save the defense global lost quantity
                for (const defenseUnit of defenseUnits)
                {
                    await defenseUnit.save()
                }

                // Save the attacker units
                let slowestUnitSpeed = 0;
                let stolenCapacity = 0;
                for (const attackUnit of attackerUnits)
                {
                    if (winner === 'attacker' && attackUnit.sent_quantity > attackUnit.lost_quantity)
                    {
                        // Get the slowest unit speed
                        const unitSpeed = attackUnit.Village_unit.Unit.movement_speed;
                        if (slowestUnitSpeed < unitSpeed)
                        {
                            slowestUnitSpeed = unitSpeed;
                        }

                        // Get the stolen capacity of alive units
                        const aliveQuantity = attackUnit.sent_quantity - attackUnit.lost_quantity;
                        const unitCarryCapacity = attackUnit.Village_unit.Unit.carrying_capacity;
                        stolenCapacity += aliveQuantity * unitCarryCapacity;
                    }
                    await attackUnit.save();
                }

                // Get the stolen resources if the attacker win
                if (winner === 'attacker')
                {
                    const defenseVillageResources = await attackedVillage.getVillage_resources({
                        where: {
                            quantity: {
                                [Op.gte]: 1
                            }
                        }
                    });

                    const totalDefenseResources = defenseVillageResources.reduce((total, resource) => {
                        return total + resource.quantity;
                    }, 0);

                    for (const resource of defenseVillageResources)
                    {
                        // y ajouter les resources volé a l'attaque
                        const resourceQuantity  = resource.quantity;
                        const stolenQuantity    = Math.floor(resourceQuantity * (stolenCapacity / totalDefenseResources));
                        const realStolenQuantity = stolenQuantity > resourceQuantity ? resourceQuantity : stolenQuantity;
                        resource.quantity       -= realStolenQuantity;
                        // resource.updated_at     = incomingAttack.arrival_date;
                        await resource.save({
                            silent: true,
                            transaction
                        });

                        // Save the stolen resources
                        await Attack_stolen_resource.create({
                            attack_id: incomingAttack.id,
                            resource_name: resource.resource_name,
                            quantity: realStolenQuantity
                        }, { transaction }); 
                    }

                    // Calculer la distance entre les deux villages
                    const attackingVillagePosition = await attackingVillage.getMap_position();
                    const attackedVillagePosition  = await attackedVillage.getMap_position();
                    const distance = this.euclideanDistance(attackedVillagePosition.x, attackedVillagePosition.y, attackingVillagePosition.x, attackingVillagePosition.y);
                    const travelTime = this.estimateTravelTime(distance, slowestUnitSpeed);
                    const arrivalTime = this.calculateArrivalTime(incomingAttack.arrival_date, travelTime);
                    incomingAttack.return_date = arrivalTime;

                }

                // Save the attack report
                incomingAttack.attack_status = winner === 'attacker' ? 'returning' : 'lost';

                await incomingAttack.save({ transaction });

                // Save the attacked village village_units
                for (const defenderUnit of defenderUnits)
                {
                    const unitInDefense = defenseUnits.find(unit => unit.village_unit_id === defenderUnit.id);

                    defenderUnit.present_quantity   -= unitInDefense.lost_quantity;
                    defenderUnit.total_quantity     -= unitInDefense.lost_quantity;
                    await defenderUnit.save({silent: true, transaction});
                }

                // Save de support units
                for (const defenderSupportUnit of defenderSupportUnits)
                {
                    const unitInDefense = defenseUnits.find(unit => unit.village_unit_id === defenderSupportUnit.village_unit_id);

                    if (!unitInDefense) 
                    {
                        continue;
                    }

                    // Save the support units
                    defenderSupportUnit.quantity -= unitInDefense.lost_quantity;
                    defenderSupportUnit.enabled  = defenderSupportUnit.quantity === 0 ? 0 : 1;
                    await defenderSupportUnit.save({ transaction });

                    // Save the support village_units
                    const village_unit                  = await defenderSupportUnit.getVillage_unit();
                    village_unit.in_support_quantity    -= unitInDefense.lost_quantity;
                    village_unit.total_quantity         -= unitInDefense.lost_quantity;
                    await village_unit.save({silent: true, transaction});
                }

                    
                // Save the attacker village_units
                const villageAttackUnit = await attackingVillage.getVillage_units();
                for (const villageUnit of villageAttackUnit)
                { 
                    const unitInAttack = attackerUnits.find(unit => unit.village_unit_id === villageUnit.id);
                    if (!unitInAttack)
                    {
                        continue;
                    }

                    villageUnit.total_quantity -= unitInAttack.lost_quantity;
                    villageUnit.in_attack_quantity -= unitInAttack.lost_quantity;
                    await villageUnit.save({silent: true, transaction});
                }
            }

            await transaction.commit();
            return true;  
        }
        catch (error)
        {
            transaction.rollback();
            console.error(error);
            throw error;
        }
    }

    /**
     * Return an array of the type of units in the attack
     * @param {Attack_attacker_unit[]} attackUnits array of attack_attacker_unit with the included village_unit and unit
     * @returns {String[]}
     */
    getTypeOfAttackUnits (attackUnits) {
        const types = attackUnits.reduce((types, unit) => {
            if (!types.includes(unit.Village_unit.Unit.unit_type))
            {
                types.push(unit.Village_unit.Unit.unit_type);
            }
            return types;
        }, []);

        return types;
    }

    /**
     * 
     * @param {number} attackId 
     * @returns {Promise<Attack_attacker_unit[]>}
     */
    getAttackerUnits (attackId) {
        return Attack_attacker_unit.findAll({
            include: [
                {
                    model: Village_unit,
                    required: true,
                    include: [
                        {
                            model: Unit,
                            required: true
                        }
                    ]
                }
            ],
            where: {
                attack_id: attackId
            }
        });
    }

    /**
     * 
     * @param {number} attackedVillageId 
     * @returns {Promise<Village_unit[]>}
     */
    getAttackedVillageUnits (attackedVillageId) {
        return Village_unit.findAll({
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
                village_id: attackedVillageId,
                present_quantity: {
                    [Op.gt]: 0
                }
            }
        });
    }

    /**
     * 
     * @param {number} attackedVillageId
     * @returns {Promise<Village_support[]>}
     */
    getAttackedVillageSupport (attackedVillageId) {
        return Village_support.findAll({
            include: [
                {
                    model: Village_unit,
                    required: true,
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
                }
            ],
            where: {
                supported_village_id: attackedVillageId,
                enabled: 1
            }
        });
    }

    async getAttackedVillageWallDefensePercent (attackedVillageId) {
        try
        {
            const wall = await Village_building.findOne({
                where: {
                    village_id: attackedVillageId,
                    type: 'wall_building'
                }
            });

            if (!wall)
            {
                return 0;
            }

            const wallDefense = await Wall_defense.findOne({
                where: {
                    building_level_id: wall.level_id
                }
            });

            if (!wallDefense)
            {
                return 0;
            }

            return wallDefense.defense_percent;
        }
        catch (error)
        {
            throw new Error(`Failed to get defense percent for village ${attackedVillageId}: ${error.message}`);
        }
    }

    async generateAttackDefenserUnits (attackId, defenserVillageUnits) {
        try 
        {
            const attackDefenserUnits = [];

            for (const defenserVillageUnit of defenserVillageUnits)
            {
                const attackDefenserUnit = await Attack_defenser_unit.create({
                    attack_id: attackId,
                    village_unit_id: defenserVillageUnit.id,
                    sent_quantity: defenserVillageUnit.present_quantity,
                    lost_quantity: 0
                });

                attackDefenserUnit.Defense_types = defenserVillageUnit.Unit.Defense_types;
                attackDefenserUnits.push(attackDefenserUnit);
            }

            return attackDefenserUnits;
        }
        catch (error)
        {
            throw new Error(`Failed to generate attack defenser units for attack ${attackId}: ${error.message}`);
        }
    }

    async generateAttackDefenserSupport (attackId, defenserVillageSupport) {
        try
        {
            const attackDefenserSupport = [];

            for (const defenserVillageSupportUnit of defenserVillageSupport)
            {
                const attackDefenserSupportUnit = await Attack_defenser_support.create({
                    attack_id: attackId,
                    village_support_id: defenserVillageSupportUnit.id,
                    sent_quantity: defenserVillageSupportUnit.quantity,
                    lost_quantity: 0
                });

                attackDefenserSupportUnit.village_unit_id = defenserVillageSupportUnit.village_unit_id
                attackDefenserSupportUnit.Defense_types   = defenserVillageSupportUnit.Village_unit.Unit.Defense_types;
                attackDefenserSupport.push(attackDefenserSupportUnit);
            }

            return attackDefenserSupport;
        }
        catch (error)
        {
            throw new Error(`Failed to generate attack defenser support for attack ${attackId}: ${error.message}`);
        }
    }

    getTotalAttackPower (attackAttackerUnits) {
        const totalAttackPower = attackAttackerUnits.reduce((total, unit) => {
            const unitAtk       =  unit.Village_unit.Unit.attack;
            const aliveQuantity = unit.sent_quantity - unit.lost_quantity;
            const totalAtk      = aliveQuantity * unitAtk;
            return total + totalAtk;
        }, 0);

        return totalAttackPower;
    }

    /**
     * 
     * @param {Attack_attacker_unit[]} attackAttackerUnits 
     * @param {string} roundUnitType 
     * @returns {{
     *  attack_power: number,
     *  sent_quantity: number,
     *  alive_quantity: number,
     *  lost_quantity: number
     * }}
     */
    generateRoundAttackUnits (attackAttackerUnits, roundUnitType) {
        const roundAttackUnits = attackAttackerUnits.reduce((total, unit) => {
            const unitType = unit.Village_unit.Unit.unit_type;

            if (unitType === roundUnitType && unit.sent_quantity > unit.lost_quantity) 
            {
                const unitAtk       =  unit.Village_unit.Unit.attack;
                const aliveQuantity = unit.sent_quantity - unit.lost_quantity;
                total.attack_power  += (aliveQuantity * unitAtk);
                total.sent_quantity += aliveQuantity;
            }
            return total;
        }, {attack_power: 0, sent_quantity: 0, alive_quantity: 0, lost_quantity: 0});

        return roundAttackUnits;
    }

    /**
     * 
     * @param {Attack_defenser_unit[] | Attack_defenser_support[]} defenserUnits
     * @param {string} roundUnitType
     * @returns {{
     * total_defense: number,
     * units: {
     * unit_id: number,
     * sent_quantity: number,
     * alive_quantity: number,
     * lost_quantity: number,
     * base_defense: number
     * }[]
     * }}
     */
    generateRoundDefenseUnits (defenserUnits, roundUnitType, roundAttackAllocationPercent) {
        const roundDefenserUnits = defenserUnits.reduce((total, unit) => {
            if (unit.sent_quantity > unit.lost_quantity)
            {
                const aliveQuantity = unit.sent_quantity - unit.lost_quantity;
                const sent_quantity = Math.round(aliveQuantity * roundAttackAllocationPercent);     
                const unit_defense  = unit.Defense_types.find(defense => defense.type === roundUnitType);   
                const base_defense  = sent_quantity * unit_defense.defense_value;   
                total.units.push({
                    unit_id: unit.village_unit_id,
                    sent_quantity: sent_quantity,
                    alive_quantity: 0,
                    lost_quantity: 0,
                    base_defense: base_defense,
                });

                total.total_defense += base_defense;
            }

            return total;
        }, {total_defense: 0, units: []});

        return roundDefenserUnits;
    }

    getRoundAlivePercent (roundAttackUnits, roundDefenseUnits, wallAdittionalDefensePercent) {
        const wallDefenseBonus          = roundDefenseUnits.total_defense * wallAdittionalDefensePercent / 100;
        const defenseWithWallBonus      = roundDefenseUnits.total_defense + wallDefenseBonus;
        const attackPowerComparison     = roundAttackUnits.attack_power - defenseWithWallBonus;
        const attackUnitAlivePercent    = attackPowerComparison / roundAttackUnits.attack_power;
        const defensePowerComparison    = defenseWithWallBonus - roundAttackUnits.attack_power;
        const defenseUnitAlivePercent   = defensePowerComparison / defenseWithWallBonus;

        return {
            attackUnitAlivePercent,
            defenseUnitAlivePercent
        }
    }

    calculateAttackerUnitsLost (attackAttackerUnits, roundUnitType, attackUnitAlivePercent) {
        for (const attackUnit of attackAttackerUnits)
        {
            if (attackUnit.Village_unit.Unit.unit_type === roundUnitType && attackUnit.sent_quantity > attackUnit.lost_quantity)
            {
                const unitsAlive         = Math.floor(attackUnitAlivePercent * (attackUnit.sent_quantity - attackUnit.lost_quantity));
                const lostQuantity       = (attackUnit.sent_quantity - attackUnit.lost_quantity) - unitsAlive;
                attackUnit.lost_quantity += lostQuantity;
            }
        }
    }

    calculateDefenserUnitsLost (defenserUnits, roundDefenseUnits, defenseUnitAlivePercent) {
        for (const defenseUnit of defenserUnits)
        {
            if (defenseUnit.sent_quantity > defenseUnit.lost_quantity)
            {
                const unitSent = roundDefenseUnits.units.find(unit => unit.unit_id === defenseUnit.village_unit_id);
                unitSent.alive_quantity       = defensePowerComparison > 0 ? Math.floor(defenseUnitAlivePercent * unitSent.sent_quantity) : 0;
                unitSent.lost_quantity        = unitSent.sent_quantity - unitSent.alive_quantity;
                defenseUnit.lost_quantity  += unitSent.lost_quantity;
            }
        }
    }

    checkWinner (attackAttackerUnits, defenserUnits) {
        if (attackAttackerUnits.every(unit => unit.lost_quantity >= unit.sent_quantity))
        {
            return 'defender';
        }
        else if (defenserUnits.every(unit => unit.lost_quantity >= unit.sent_quantity))
        {
            return 'attacker';
        }
        else 
        {
            return null;
        }
    }


    async processAttack (attack) {
        try
        {
            // Gagnant de l'attaque
            let winner = null;

            // l'attaque
            const attack = attack;

            // Le village attaqué
            const attackedVillage = await Village.findByPk(attack.attacked_village_id, {
                include: [
                    {
                        model: Map_position,
                        required: true
                    }
                ]
            });

            // Le village attaquant
            const attackingVillage = await Village.findByPk(attack.attacking_village_id, {
                include: [
                    {
                        model: Map_position,
                        required: true
                    }
                ]
            });

            // troupes attaquantes
            const attackAttackerUnits = await this.getAttackerUnits(attack.id);

            // Types d'unités attaquantes
            const unitTypesInAttack = this.getTypeOfAttackUnits(attackAttackerUnits);

            // troupes en défense
            const defenserVillageUnit = await this.getAttackedVillageUnits(attackedVillage.id);

            // troupes en support
            const defenserVillageSupport = await this.getAttackedVillageSupport(attackedVillage.id);

            // pourcentage de défense du mur
            const wallAdittionalDefensePercent = await this.getAttackedVillageWallDefensePercent(attackedVillage.id);

            // Création des unités en défense
            const attackDefenserUnits = await this.generateAttackDefenserUnits(attack.id, defenserVillageUnit);
            const attackDefenserSupport = await this.generateAttackDefenserSupport(attack.id, defenserVillageSupport);

            // Regroupement des unités en défense sous un tableau
            const defenserUnits = attackDefenserUnits.concat(attackDefenserSupport);

            // Si le village attaqué n'a pas d'unités en défense, l'attaquant gagne
            if (defenserUnits.length === 0)
            {
                winner = 'attacker';
            }

            // Boucle de simulation de l'attaque
            let round = 1;
            while(winner === null)
            {
                const roundTotalAttackPower = this.getTotalAttackPower(attackAttackerUnits);

                // Pour chaque type d'unité attaquante
                for (const roundUnitType of unitTypesInAttack)
                {
                    // Total d'unités attaquantes pour le type d'unité en cours
                    const roundAttackUnits = this.generateRoundAttackUnits(attackAttackerUnits, roundUnitType);
                    
                    // Pourcentage d'unités attaquantes pour le type d'unité en cours
                    const roundAttackAllocationPercent = roundAttackUnits.attack_power / roundTotalAttackPower;

                    // Total d'unités en défense pour le type d'unité en cours
                    const roundDefenseUnits = this.generateRoundDefenseUnits(defenserUnits, roundUnitType, roundAttackAllocationPercent);

                    // Calcul de pourcentage des unités en vie
                    const { attackUnitAlivePercent, defenseUnitAlivePercent } = this.getRoundAlivePercent(roundAttackUnits, roundDefenseUnits, wallAdittionalDefensePercent);

                    // Calcul du nombre d'unités perdues pour l'attaquant
                    this.calculateAttackerUnitsLost(attackAttackerUnits, roundUnitType, attackUnitAlivePercent);

                    // Calcul du nombre d'unités perdues pour le défenseur
                    this.calculateDefenserUnitsLost(defenserUnits, roundDefenseUnits, defenseUnitAlivePercent);

                    // Suppression du type d'unité si la puissance d'attaque est négative ou égale à 0
                    if (roundAttackUnits.attack_power <= 0) {
                        unitTypesInAttack.splice(unitTypesInAttack.indexOf(roundUnitType), 1);
                    }
                }

                // Vérification s'il y a un gagnant
                winner = this.checkWinner(attackAttackerUnits, defenserUnits);

                // Si le nombre de round dépasse 20, l'attaque est annulée
                round++;
                if (round > 20)
                {
                    throw new Error('Too many rounds');
                }
            }




            // Ce que je retourne 
            // l'attaque
            // les troupes attaquantes 
            // les troupes défensives (defense et support) sous forme de tableau 
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

    /**
     * Attack simulation
     * @param {Array.<{name: String, quantity: Number}>} attackUnits - The units in attack
     * @param {Array.<{name: String, quantity: Number}>} defenseUnits - The units in defense
     * @param {Object} wallLevel - The wall level
     * @param {Number} wallLevel.level_id - The wall level id
     * @throws {NotFoundError} - When the resource is not found
     * @throws {BadRequestError} - When the request is not valid
     * @returns {Promise<Object>}
     */ 
    async attackSimulation(attackUnits, defenseUnits, wallLevel) {
        try 
        {
            const attackerUnits     = [];
            const attackerTypes     = [];
            const results           = {};
            const defenderUnits     = [];
            let winner              = null;
            let round               = 1;
            let defensePercentWall  = 0;

            // Get the units in attack and set it to the attackerUnits array
            for (const attackUnit of attackUnits) 
            {
                const unit = await Unit.findByPk(attackUnit.name, {
                    attributes: ['name', 'attack', 'unit_type'],
                });

                if (!unit) 
                {
                    throw new NotFoundError(`Attack unit ${attackUnit.name} not found.`);
                }

                if (!attackerTypes.includes(unit.unit_type)) 
                {
                    attackerTypes.push(unit.unit_type);
                }

                attackerUnits.push({
                    unit_name: unit.name,
                    attack: unit.attack,
                    unit_type: unit.unit_type,
                    quantity: attackUnit.quantity,
                });
            }
            
            if (attackerUnits.length === 0) 
            {
                throw new BadRequestError('No attack units.');
            }

            // Get the units in defense and set it to the defenderUnits array
            for (const defenseUnit of defenseUnits) 
            {
                const unit = await Unit.findByPk(defenseUnit.name, {
                    include: {
                        model: Defense_type,
                        required: true
                    }
                });

                if (!unit)
                {
                    throw new NotFoundError(`Dénfense unit ${defenseUnit.name} not found.`);
                }

                const completeUnit = {
                    unit_name: unit.name,
                    attack: unit.attack,
                    unit_type: unit.unit_type,
                    quantity: defenseUnit.quantity,
                    defense: {}
                };

                unit.Defense_types.map(defenseType => {
                    return completeUnit.defense[defenseType.type] = defenseType.defense_value;
                })

                defenderUnits.push(completeUnit);
            }

            if (defenderUnits.length === 0)
            {
                winner = 'attacker';
            }

            // Get the wall defense percent if the wall level is specified
            if (wallLevel && wallLevel.level_id) 
            {
                const wall = await Wall_defense.findOne({
                    where: {
                        building_level_id: wallLevel.level_id
                    }
                });

                if (!wall)
                {
                    throw new NotFoundError(`Wall level ${wallLevel.level_id} not found.`);
                }

                defensePercentWall = wall.defense_percent;
            }

            console.log('avant la boucle');

            // Attack simulation loop 
            while(winner === null)
            {
                // Get the total attack power of the attacker
                const roundTotalAtk = attackerUnits.reduce((total, unit) => {
                    return total + (unit.quantity * unit.attack);
                }, 0);

                for (const type of attackerTypes) {
                    // Total of units in attack for the type of weapon in progress
                    const roundAtkUnits = attackerUnits.reduce((total, unit) => {
                        if (unit.unit_type === type && unit.quantity > 0) 
                        {
                            total.attack_power  += (unit.quantity * unit.attack);
                            total.sent_quantity += unit.quantity;
                            return total;
                        }
                        return total;
                    }, {attack_power: 0, sent_quantity: 0, alive_quantity: 0, lost_quantity: 0});


                    // Percentage of units in attack for the type of weapon in progress
                    const roundAtkAlocationPercent = roundAtkUnits.attack_power / roundTotalAtk;

                    // Total of units in defense for the type of weapon in progress
                    const roundDefUnits = defenderUnits.reduce((total, unit) => {
                        if (unit.quantity > 0) 
                        {
                            const sent_quantity = Math.round(unit.quantity * roundAtkAlocationPercent);
                            const base_defense  = sent_quantity * unit.defense[type];
                            total.units.push({
                                unit_name: unit.unit_name,
                                sent_quantity: sent_quantity,
                                alive_quantity: 0,
                                lost_quantity: 0,
                                base_defense: base_defense,
                            });

                            total.total_defense += base_defense;
                        }   
                        return total;
                    }, {total_defense: 0, units: []});

                    // Attack and defense comparison with alive percent
                    const defWithWallBonus        = roundDefUnits.total_defense + (roundDefUnits.total_defense * defensePercentWall / 100);
                    const atkPowerComparison      = roundAtkUnits.attack_power - defWithWallBonus;
                    const atkUnitAlivePercent     = atkPowerComparison / roundAtkUnits.attack_power;
                    const defensePowerComparison  = defWithWallBonus - roundAtkUnits.attack_power;
                    const defenseUnitAlivePercent = defensePowerComparison / defWithWallBonus;


                    // Calculs of the number of units lost for the attacker 
                    roundAtkUnits.alive_quantity  =  atkPowerComparison > 0 ? Math.round(atkUnitAlivePercent * roundAtkUnits.sent_quantity) : 0;
                    roundAtkUnits.lost_quantity   = roundAtkUnits.sent_quantity - roundAtkUnits.alive_quantity;

                    for (const attackUnit of attackerUnits) {
                        if (attackUnit.unit_type === type) {
                            const unitsAlive = atkPowerComparison > 0 ? Math.round(atkUnitAlivePercent * attackUnit.quantity) : 0;
                            attackUnit.quantity = unitsAlive;
                        }
                    }

                    // Calculs of the number of units lost for the defender
                    for (const defenseUnit of defenderUnits) {
                        if (defenseUnit.quantity > 0) {
                            const unitSent = roundDefUnits.units.find(unit => unit.unit_name === defenseUnit.unit_name);
                            unitSent.alive_quantity = defensePowerComparison > 0 ? Math.round(defenseUnitAlivePercent * unitSent.sent_quantity) : 0;
                            unitSent.lost_quantity  = unitSent.sent_quantity - unitSent.alive_quantity;
                            defenseUnit.quantity    -= unitSent.lost_quantity;
                        }
                    }

                    roundDefUnits.units.forEach(unit => {
                        unit.alive_quantity = defensePowerComparison > 0 ? Math.round(defenseUnitAlivePercent * unit.sent_quantity) : 0;
                        unit.lost_quantity  = unit.sent_quantity - unit.alive_quantity;
                    });

                    // Set the results of the round
                    results[`round_${round}`] = {
                        roundAtkUnits,
                        roundDefUnits,
                    };

                    // Remove the type of weapon if the attack power is negative or equal to 0
                    if (atkPowerComparison <= 0) {
                        attackerTypes.splice(attackerTypes.indexOf(type), 1);
                    }

                }
                
                // Check if there is a winner
                if (attackerUnits.every(unit => unit.quantity === 0)) {
                    winner = 'defender';
                    break;
                }
                else if (defenderUnits.every(unit => unit.quantity === 0)) {
                    winner = 'attacker';
                    break;
                }

                round++;
                if (round > 20) {
                    throw new Error('Too many rounds');
                }
            }

            const attackReport = {
                defenderUnits,
                attackerUnits,
                winner: winner,
                results,
            };

            return attackReport;
        }
        catch (error)
        {
            throw error;
        }
    }
}

module.exports = new AttackService()