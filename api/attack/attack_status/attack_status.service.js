const NotFoundError = require('../../../errors/not-found');
const { Attack_status } = require('../../../database/index').models;

class AttackStatusService {
    /**
     * Returns all attack status
     * @returns {Promise<Attack_status[]>}
     */ 
    getAll() {
        return Attack_status.findAll();
    }

    /**
     * Returns attack status by name
     * @param {String} name - The attack status name
     * @throws {NotFoundError} when attack status not found
     * @returns {Promise<Attack_status>}
     */ 
    async getByName(name) {
        try
        {
            console.log("name : " + name);
            const attackStatus = await Attack_status.findByPk(name);

            if (!attackStatus) 
            {
                throw new NotFoundError('Attack_status not found');
            }

            return attackStatus;
        }
        catch(error)
        {
            throw new NotFoundError('Attack_status not found');
        }
    }

    /**
     * Create a attack status
     * @param {Object} data - Data to create an attack status
     * @returns {Promise<Attack_status>}
     */
    create(data) {
        return Attack_status.create(data);
    }

    /**
     * Update a attack status
     * @param {String} name - The attack status name
     * @param {Object} data - Data to update an attack status
     * @returns {Promise<Attack_status>}
     */
    update(name, data) {
        return Attack_status.update(data, {
            where: {
                name: name
            }
        });
    }

    /**
     * Delete an attack status
     * @param {String} name - The attack status name
     * @throws {NotFoundError} when attack status not found
     * @returns {Promise<Attack_status>}
     */
    async delete(name) {
        try
        {
            const attackStatus = await this.getByName(name);

            return attackStatus.destroy();
        }
        catch(error)
        {
            throw new NotFoundError('Attack_status not found');
        }
    }
}

module.exports = new AttackStatusService();