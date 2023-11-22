const NotFoundError = require('../../errors/not-found');

const { Attack } = require('../../database/index').models;

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
}

module.exports = new AttackService();