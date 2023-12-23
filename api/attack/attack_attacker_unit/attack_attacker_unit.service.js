const NotFoundError = require('../../../errors/not-found');
const { Attack_attacker_unit } = require('../../../database/index').models;

class AttackAttackerUnitService {
    /**
     * Returns all attack_untits
     * @returns {Promise<Attack_attacker_unit[]>}
     */ 
    getAll() {
        return Attack_attacker_unit.findAll();
    }

    /**
     * Returns attack_untit by id
     * @param {Number} id - The attack_untit id
     * @throws {NotFoundError} when attack_untit not found
     * @returns {Promise<Attack_attacker_unit>}
     */ 
    async getById(id) {
        try
        {
            const attackUnit = await Attack_attacker_unit.findByPk(id);

            if (!attackUnit) 
            {
                throw new NotFoundError('Attack_attacker_unit not found');
            }

            return attackUnit;
        }
        catch(error)
        {
            throw new NotFoundError('Attack_attacker_unit not found');
        }
    }

    /**
     * Create a attack_untit
     * @param {Object} data - Data to create an attack_untit
     * @returns {Promise<Attack_attacker_unit>}
     */
    create(data) {
        return Attack_attacker_unit.create(data);
    }

    /**
     * Update a attack_untit
     * @param {Number} id - The attack_untit id
     * @param {Object} data - Data to update an attack_untit
     * @returns {Promise<Attack_attacker_unit>}
     */
    update(id, data) {
        return Attack_attacker_unit.update(data, {
            where: {
                id: id
            }
        });
    }

    /**
     * Delete an attack_untit
     * @param {Number} id - The attack_untit id
     * @throws {NotFoundError} when attack_untit not found
     * @returns {Promise<Attack_attacker_unit>}
     */
    async delete(id) {
        try
        {
            const attackUnit = await this.getById(id);

            if (!attackUnit) 
            {
                throw new NotFoundError('Attack_attacker_unit not found');
            }

            return attackUnit.destroy();
        }
        catch(error)
        {
            throw new NotFoundError('Attack_attacker_unit not found');
        }
    }
}

module.exports = new AttackAttackerUnitService();