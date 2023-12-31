const { Op } = require('sequelize');
const { sequelize } = require('../../database/index');
const BadRequestError = require('../../errors/bad-request');
const NotFoundError = require('../../errors/not-found');
const EuclideanDistanceCalculator = require('../../utils/euclideanDistanceCalculator');
const VillageBuildingService = require('../village/village_building/village_building.service');
const VillageResourceService = require('../village/village_resource/village_resource.service');
const VillageUnitService = require('../village/village_unit/village_unit.service');
const SupportService = require('../support/support.service');
const { 
    Map_position, 
    Unit, 
    Defense_type,
    Village, 
    Village_unit, 
    Village_support,
    Village_resource,
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
            const { x: startingPointX, y: startingPointY } = attackingVillage.Map_position;
            const { x: arrivalPointX, y: arrivalPointY }   = attackedVillage.Map_position;

            const euclideanCalculator       = new EuclideanDistanceCalculator(startingPointX, startingPointY, arrivalPointX, arrivalPointY);
            attack.arrival_date             = euclideanCalculator.getArrivalDate(new Date(attack.departure_date), slowestUnitSpeed);
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

    async handleIncommingAttacks(villageId, arrivalDate = new Date()) {
        try
        {
            const incomingAttacks = await Attack.findAll({
                where: {
                    attacked_village_id: villageId,
                    attack_status: 'attacking',
                    arrival_date: {
                        [Op.lt]: arrivalDate
                    }
                }
            });

            if (!incomingAttacks)
            {
                return;
            }

            for (const attack of incomingAttacks)
            {
                const offensiveAttack = attack.attacking_village_id === villageId;
                await this.processAttack(attack, offensiveAttack);
            }
        }
        catch (error)
        {
            console.error(error);
            throw error;
        }
    }

    async processAttack (attack, offensiveAttack) {
        const transaction = await sequelize.transaction();
        try
        {
            const arrivalDate = new Date(attack.arrival_date);
            // Gagnant de l'attaque
            let winner = null;

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

            // Check si le village mis a jour est l'attaquant, alors on met a jour les attaques du défenseur 
            // avant la date de l'attaque en cours
            if (offensiveAttack)
            {
                await this.handleIncommingAttacks(attackedVillage.id, arrivalDate);
            }
            
            // probleme ici 
            await this.updateVillageBeforeAttack(attackedVillage.id, arrivalDate);

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

            // Si l'attaquant gagne, on récupère les ressources volées et on set la date de retour
            if (winner === 'attacker')
            {
                const stolenCapacity   = this.getAttackerStolenCapacity(attackAttackerUnits);
                const slowestUnitSpeed = this.getAttackerSlowestUnitSpeed(attackAttackerUnits);

                // Récupération des ressources volées
                await this.generateAttackStolenResources(attackedVillage.id, attack.id, stolenCapacity, transaction);

                const { x: attackedVillageX,  y: attackedVillageY }   = attackedVillage.Map_position;
                const { x: attackingVillageX, y: attackingVillageY }  = attackingVillage.Map_position;

                const euclideanCalculator = new EuclideanDistanceCalculator(attackedVillageX, attackedVillageY, attackingVillageX, attackingVillageY);
                attack.return_date        = euclideanCalculator.getArrivalDate(arrivalDate, slowestUnitSpeed);
            }

            // Sauvegarde du rapport de l'attaque
            attack.attack_status = winner === 'attacker' ? 'returning' : 'lost';
            await attack.save({ transaction });

            // Sauvegarde des unités du village attaqué
            await this.saveDefenserLosses(defenserUnits, defenserVillageSupport, defenserVillageUnit, transaction);

            // Sauvegarde des unités du village attaquant
            await this.saveAttackerLosses(attackAttackerUnits, attackingVillage.id, transaction);

            await transaction.commit();
        }
        catch (error)
        {
            transaction.rollback();
            throw error;
        }
    }

    /**
     * Get the returning troops in attacks
     * @param {number} villageId - The village id
     * @returns {Promise<void>}
     */
    async handleReturningAttacks (villageId, returnDate = new Date()) {
        try 
        {
            const returningAttacks = await Attack.findAll({
                where: {
                    attacking_village_id: villageId,
                    attack_status: 'returning',
                    return_date: {
                        [Op.lt]: returnDate
                    }
                }
            });

            for (const attack of returningAttacks)
            {
                await this.processReturningAttack(attack);
            }
        }
        catch (error)
        {
            throw error(`Failed to handle returning attacks for village ${villageId}: ${error.message}`);
        }
    }

    /**
     * Process the returning attack
     * @param {Attack} attack - The attack to process
     * @returns {Promise<void>}
     */
    async processReturningAttack (attack) {
        const transaction = await sequelize.transaction();
        try
        {
            // Récupérer les troupes et les réatribué au village via les villages_unit
            await this.reassignAttackerUnits(attack, transaction);

            // Récupérer les ressources volées et les réatribué au village via les villages_resources 
            await this.allocateStolenResources(attack, transaction);

            // Passer l'attaque au statut returned
            attack.attack_status = 'returned';
            await attack.save({ transaction });
            await transaction.commit();
        }
        catch (error)
        {
            await transaction.rollback();
            throw error(`Failed to process returning attack ${attack.id}: ${error.message}`);
        }
    }

    /**
     * Reassign the attacker units to the village
     * @param {Attack} attack - The attack to process
     * @param {Sequelize.Transaction} transaction - The transaction
     * @return {Promise<void>}
     */
    async reassignAttackerUnits (attack, transaction) {
        try
        {
           const attackUnits  = await this.getAttackerUnits(attack.id); 
           const promiseArray = [];

           for (const attackUnit of attackUnits)
           {
                const villageUnit      = attackUnit.Village_unit;
                const reassignQuantity = attackUnit.sent_quantity - attackUnit.lost_quantity;
                if (reassignQuantity > 0)
                {
                    villageUnit.present_quantity    += reassignQuantity;
                    villageUnit.in_attack_quantity -= reassignQuantity;
                    promiseArray.push(villageUnit.save({ transaction }));
                }
           }

           await Promise.all(promiseArray);
        }
        catch (error)
        {
            throw error(`Failed to reassign attacker units for attack ${attack.id}: ${error.message}`);
        }
    }

    /**
     * Allocate the stolen resources to the village
     * @param {Attack} attack - The attack to process
     * @param {Sequelize.Transaction} transaction - The transaction
     * @return {Promise<void>}
     */
    async allocateStolenResources (attack, transaction) {
        try
        {
            const stolenResources = await Attack_stolen_resource.findAll({
                where: {
                    attack_id: attack.id
                }
            });
            
            const villageResources = await sequelize.query('CALL get_all_village_resources_by_village_id(:villageId)', {
                replacements: { villageId: attack.attacking_village_id }
            });

            const promiseArray = [];

            for (const stolenResource of stolenResources)
            {
                const villageResource = villageResources.find(resource => resource.resource_name === stolenResource.resource_name);
                const stolenQuantity  = stolenResource.quantity;
                const storageCapacity = villageResource.village_resource_storage;
                const currentQuantity = villageResource.village_resource_quantity;
                const newQuantity     = currentQuantity + stolenQuantity > storageCapacity ? storageCapacity : currentQuantity + stolenQuantity;

                const promise = Village_resource.update(
                    {
                        quantity: newQuantity
                    }, 
                    {
                        where: {
                            id: villageResource.village_resource_id
                        },
                        transaction,
                        silent: true
                    }
                )

                promiseArray.push(promise);
            }

            await Promise.all(promiseArray);
        }
        catch (error)
        {
            throw error(`Failed to allocate stolen resources for attack ${attack.id} : ${error.message}`);
        }
    }
    
    /**
     * Update the all village attributes before attack
     * @param {number} villageId - The village id
     * @param {Date} updateDate - The date to update the village, default is now
     * @returns {Promise<void>}
     */ 
    async updateVillageBeforeAttack (villageId, updateDate = new Date()) {
        try
        {
            await VillageResourceService.updateVillageResource(villageId, updateDate);
            await VillageBuildingService.createUniqueVillageBuildingWhenConstructionProgressIsFinished(villageId, updateDate);
            await VillageBuildingService.updateUniqueVillageBuildingWhenConstructionProgressIsFinished(villageId, updateDate);
            await VillageUnitService.addUnitAfterTraining(villageId, updateDate);
            await this.handleReturningAttacks(villageId, updateDate);
            await SupportService.handleSupport(villageId, updateDate);
            await SupportService.handleReturningSupport(villageId, updateDate);
        }
        catch (error)
        {   
            throw error(`Failed to update village ${villageId} before attack: ${error.message}`);
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
     * Get the Attack_attacker_unit with associated village_unit and unit for the attack
     * @param {number} attackId - The attack id
     * @returns {Promise<Attack_attacker_unit[]>} - Return an array of Attack_attacker_unit with associated village_unit and unit
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
     * Get the Village_unit with associated unit and defense_type for the attacked village
     * @param {number} attackedVillageId - The attacked village id
     * @returns {Promise<Village_unit[]>} - Return an array of Village_unit with associated unit and defense_type
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
     * Get the Village_support with associated village_unit , unit and defense_types for the attacked village
     * @param {number} attackedVillageId - The attacked village id
     * @returns {Promise<Village_support[]>} - Return an array of Village_support with associated village_unit , unit and defense_types
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

    /**
     * Get the wall defense percent of the attacked village
     * @param {number} attackedVillageId - The attacked village id
     * @returns {Promise<number>} - Return the wall defense percent
     */ 
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

    /**
     * Generate the attack defenser units with associated defense_types
     * @param {number} attackId - The attack id
     * @param {Village_unit[]} defenserVillageUnits - The village units with the included unit and defense_types of the attacked village
     * @returns {Promise<Attack_defenser_unit[]>} - Return an array of Attack_defenser_unit with associated  defense_types
     */ 
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

    /**
     * Generate the attack defenser support with associated village_unit and defense_types
     * @param {number} attackId - The attack id
     * @param {Village_support[]} defenserVillageSupport - The village support of the attacked village with the included village_unit, unit and defense_types
     * @returns {Promise<Attack_defenser_support[]>} - Return an array of Attack_defenser_support with associated village_unit_id and defense_types
     */ 
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

    /**
     * Generate and return the total attack power of the attack_attackers_units with the included village_unit and unit
     * @param {Attack_attacker_unit[]} attackAttackerUnits - The attack_attacker_units with the included village_unit and unit
     * @returns {number} - The total attack power
     */ 
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
     * Generate the units in the attack round by there types 
     * @param {Attack_attacker_unit[]} attackAttackerUnits - The attack_attacker_units with the included village_unit and unit
     * @param {string} roundUnitType - The type of unit for the round
     * @returns {{
     *  attack_power: number,
     *  sent_quantity: number,
     *  alive_quantity: number,
     *  lost_quantity: number
     * }} - Return the units in the attack round
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
     * Generate the defense units in the attack round by the type of attacker unit
     * @param {Attack_defenser_unit[] | Attack_defenser_support[]} defenserUnits - The defense units in the attack round with the included defense_types
     * @param {string} roundUnitType - The type of unit for the round
     * @returns {{
     * total_defense: number,
     * units: {
     * unit_id: number,
     * sent_quantity: number,
     * alive_quantity: number,
     * lost_quantity: number,
     * base_defense: number
     * }[]
     * }} - Return the defense units in the attack round
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

    /**
     * Calculate the alive percent of the attack units and the defense units
     * @param {{}} roundAttackUnits - The attack units in the round
     * @param {{}} roundDefenseUnits - The defense units in the round
     * @param {number} wallAdittionalDefensePercent - The wall defense percent
     * @returns {{
     * attackUnitAlivePercent: number,
     * defenseUnitAlivePercent: number
     * }} - Return the alive percent of the attack units and the defense units
     */ 
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

    /**
     * Calculate the units lost for the attacker
     * @param {Attack_attacker_unit[]} attackAttackerUnits - The attack units with the included village_unit and unit
     * @param {string} roundUnitType - The type of unit for the round
     * @param {number} attackUnitAlivePercent - The alive percent of the attack units
     * @returns {void}
     */
    calculateAttackerUnitsLost (attackAttackerUnits, roundUnitType, attackUnitAlivePercent) {
        for (const attackUnit of attackAttackerUnits)
        {
            if (attackUnit.Village_unit.Unit.unit_type === roundUnitType && attackUnit.sent_quantity > attackUnit.lost_quantity)
            {
                const unitsAlive         = attackUnitAlivePercent > 0 ? Math.floor(attackUnitAlivePercent * (attackUnit.sent_quantity - attackUnit.lost_quantity)) : 0;
                const lostQuantity       = (attackUnit.sent_quantity - attackUnit.lost_quantity) - unitsAlive;
                attackUnit.lost_quantity += lostQuantity;
            }
        }
    }

    /**
     * Calculate the units lost for the defenser
     * @param {Attack_defenser_unit[] | Attack_support_unit[]} defenserUnits - The defense units in the attack round
     * @param {{}} roundDefenseUnits - The defense units in the attack round
     * @param {number} defenseUnitAlivePercent - The alive percent of the defense units
     * @returns {void}
     */ 
    calculateDefenserUnitsLost (defenserUnits, roundDefenseUnits, defenseUnitAlivePercent) {
        for (const defenseUnit of defenserUnits)
        {
            if (defenseUnit.sent_quantity > defenseUnit.lost_quantity)
            {
                const unitSent = roundDefenseUnits.units.find(unit => unit.unit_id === defenseUnit.village_unit_id);
                unitSent.alive_quantity       = defenseUnitAlivePercent > 0 ? Math.floor(defenseUnitAlivePercent * unitSent.sent_quantity) : 0;
                unitSent.lost_quantity        = unitSent.sent_quantity - unitSent.alive_quantity;
                defenseUnit.lost_quantity  += unitSent.lost_quantity;
            }
        }
    }

    /**
     * Check if there is a winner
     * @param {Attack_attacker_unit[]} attackAttackerUnits - The attack units with the included village_unit and unit
     * @param {Attack_defenser_unit[] | Attack_support_unit[]} defenserUnits - The defense units in the attack round
     * @returns {string | null} - Return the winner or null if there is no winner
     */ 
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

    /**
     * Get the total stolen capacity of the attacker
     * @param {Attack_attacker_unit[]} attackAttackerUnits  - The attacker units with the included village_unit and unit
     * @returns {number} - The total stolen capacity
     */
    getAttackerStolenCapacity (attackAttackerUnits) {
        const stolenCapacity = attackAttackerUnits.reduce((total, unit) => {
            const aliveQuantity      = unit.sent_quantity - unit.lost_quantity;
            if (aliveQuantity > 0)
            {
                const unitCarryCapacity = unit.Village_unit.Unit.carrying_capacity;
                total += aliveQuantity * unitCarryCapacity;
            }
            return total;
        }, 0);
        return stolenCapacity;
    }

    /**
     * Get slowest alive unit speed
     * @param {Attack_attacker_unit[]} attackAttackerUnits  - The attacker units with the included village_unit and unit
     * @returns {number} - The slowest alive unit speed
     */
    getAttackerSlowestUnitSpeed (attackAttackerUnits) {
        const slowestUnitSpeed = attackAttackerUnits.reduce((slowestUnitSpeed, unit) => {
            if (unit.lost_quantity < unit.sent_quantity)
            {
                const unitSpeed = unit.Village_unit.Unit.movement_speed;
                if (slowestUnitSpeed < unitSpeed)
                {
                    slowestUnitSpeed = unitSpeed;
                }
            }
            return slowestUnitSpeed;
        }, 0);
        return slowestUnitSpeed;
    }

    /**
     * Save the defense losses for support units and village units
     * @param {Attack_defenser_unit[] || Attack_support_unit} defenserUnits - The defense related to the attack
     * @param {Village_support[]} villageSupportUnits - The support units of the attacked village
     * @param {Village_unit[]} villageUnits - The village units of the attacked village
     * @param {Sequelize.transaction} transaction - The transaction
     */
    async saveDefenserLosses (defenserUnits, villageSupportUnits, villageUnits, transaction) {
        try
        {
            // Sauvegarde des unités en défense
            for (const defenserUnit of defenserUnits)
            {
                await defenserUnit.save()
            }

            // Sauvegarde des unités en support
            for (const villageSupportUnit of villageSupportUnits)
            {
                const unitInDefense = defenserUnits.find(unit => unit.village_unit_id === villageSupportUnit.village_unit_id);

                if (!unitInDefense) 
                {
                    continue;
                }

                // Sauvegarde des unités en support
                villageSupportUnit.quantity -= unitInDefense.lost_quantity;
                villageSupportUnit.enabled  = villageSupportUnit.quantity === 0 ? 0 : 1;
                await villageSupportUnit.save({ transaction });

                // Sauvegarde des unités du village en support
                const village_unit                  = await villageSupportUnit.getVillage_unit();
                village_unit.in_support_quantity    -= unitInDefense.lost_quantity;
                village_unit.total_quantity         -= unitInDefense.lost_quantity;
                await village_unit.save({ transaction, silent: true });
            }

            // Sauvegarde des unités du village
            for (const villageUnit of villageUnits)
            { 
                const unitInDefense = defenserUnits.find(unit => unit.village_unit_id === villageUnit.id);

                if (!unitInDefense)
                {
                    continue;
                }

                villageUnit.total_quantity      -= unitInDefense.lost_quantity;
                villageUnit.present_quantity    -= unitInDefense.lost_quantity;
                await villageUnit.save({ transaction, silent: true });
            }
        }
        catch (error)
        {
            throw new Error(`Failed to save defenser losses: ${error.message}`);
        }
    }

    /**
     * Save the attacker losses
     * @param {Attack_attacker_unit[]} attackAttackerUnits - The attacker units with the included village_unit and unit
     * @param {number} attackingVillageId - The attacking village id
     * @param {Sequelize.transaction} transaction - The transaction
     * @returns {Promise<void>}
     */ 
    async saveAttackerLosses (attackAttackerUnits, attackingVillageId, transaction) {
        try
        {
            for (const attackAttackerUnit of attackAttackerUnits)
            {
                await attackAttackerUnit.save();
            }

            const villageUnits = await Village_unit.findAll({
                where: {
                    village_id: attackingVillageId
                }
            });

            for (const villageUnit of villageUnits)
            {
                const unitInAttack = attackAttackerUnits.find(unit => unit.village_unit_id === villageUnit.id);

                if (!unitInAttack)
                {
                    continue;
                }

                villageUnit.total_quantity -= unitInAttack.lost_quantity;
                villageUnit.in_attack_quantity -= unitInAttack.lost_quantity;
                await villageUnit.save({ transaction, silent: true });
            }
        }
        catch (error)
        {
            throw new Error(`Failed to save attacker losses: ${error.message}`);
        }
    }

    /**
     * Generate the stolen resources and update the village resources stolen
     * @param {number} attackedVillageId - The attacked village id
     * @param {number} attackId - The attack id
     * @param {number} stolenCapacity  - The total stolen capacity
     * @param {Sequelize.Transaction} transaction - The transaction
     * @returns {Promise<Attack_stolen_resource[] || Village_resource[]>} - Return the promise of saved village_resources and attack_stolen_resources
     */
    async generateAttackStolenResources (attackedVillageId, attackId, stolenCapacity, transaction) {
        try
        {
            const villageResources = await Village_resource.findAll({
                where: {
                    village_id: attackedVillageId,
                    quantity: {
                        [Op.gte]: 1
                    }
                }
            })

            const promises = [];

            const totalResources = villageResources.reduce((total, resource) => {
                return total + resource.quantity;
            }, 0);

            for (const villageResource of villageResources)
            {
                const resourceQuantity   = villageResource.quantity;
                const stolenQuantity     = Math.floor(resourceQuantity * (stolenCapacity / totalResources));
                const realStolenQuantity = stolenQuantity > resourceQuantity ? resourceQuantity : stolenQuantity;
                villageResource.quantity -= realStolenQuantity;

                promises.push(villageResource.save({
                    silent: true,
                    transaction
                }));

                promises.push(Attack_stolen_resource.create({
                    attack_id: attackId,
                    resource_name: villageResource.resource_name,
                    quantity: realStolenQuantity
                }, { transaction }));
            }

            return Promise.all(promises);
        }
        catch (error)
        {
            throw new Error(`Failed to generate attack stolen resources for attack ${attackId}: ${error.message}`);
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