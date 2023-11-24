const { sequelize } = require('../../database/index');
const BadRequestError = require('../../errors/bad-request');
const NotFoundError = require('../../errors/not-found');
const VillageService = require('../village/village.service');
const { Attack, Village_unit, Unit, Attack_unit } = require('../../database/index').models;

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
            const attackedVillage = await VillageService.getById(data.attackedVillageId);
            const attackingVillage = await VillageService.getById(data.attackingVillageId);
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

            const attack = await this.create({
                attacked_village_id: attackedVillage.id,
                attacking_village_id: attackingVillage.id,
                attack_status: 'in progress',
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
                }, { transaction });

                await villageUnitData.update({
                    present_quantity: villageUnitData.present_quantity - villageUnit.quantity,
                    in_attack_quantity: villageUnitData.in_attack_quantity + villageUnit.quantity
                }, { transaction });
            }

            if (slowestUnitSpeed === 0)
            {
                throw new Error('Unit speed cannot be 0.');
            }

            // date + 1 day for ariaval date
            const datetest = new Date(Date.now() + 24*60*60*1000);
            attack.arrival_date = datetest;
            console.log("la", attack);
            await attack.save();
            
            if (attack.arrival_date < new Date() || attack.arrival_date !== datetest)
            {
                console.log("ici ?");
                await attack.destroy()
                throw new Error('Invalid arrival date');
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
}

module.exports = new AttackService();