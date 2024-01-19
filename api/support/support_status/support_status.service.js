const NotFoundError = require('../../../errors/not-found');

const { Support_status } = require('../../../database/index').models;

class SupportStatusService {
    /**
     * Get all Support_status
     * @returns {Promise<Support_status[]>}
     */
    getAll () {
        return Support_status.findAll();
    }

    /**
     * Get Support_status by id
     * @param id
     * @returns {Promise<Support_status>}
     */
    async getById (id) {
        try
        {
            const supportSatus = await Support_status.findByPk(id);
            if (!supportSatus) throw new NotFoundError(`Support_status with id: ${id} not found`);
            return supportSatus;
        }
        catch (error)
        {
            throw error;
        }   
    }   

    /**
     * Create Support_status
     * @param data - Support_status data
     * @param data.name - Support_status name
     * @returns {Promise<Support_status>}
     */
    create (data) {
        return Support_status.create(data);
    }

    /**
     * Update Support_status by id
     * @param id
     * @param data - Support_status data
     * @param data.name - Support_status name
     * @returns {Promise<Support_status>}
     */
    async update (id, data) {
        try
        {
            const supportSatus = await this.getById(id);
            return await supportSatus.update(data);
        }
        catch (error)
        {
            throw error;
        }
    }

    /**
     * Delete Support_status by id
     * @param id
     * @returns {Promise<Support_status>}
     */
    async delete (id) {
        try
        {
            const supportSatus = await this.getById(id);
            return await supportSatus.destroy();
        }
        catch (error)
        {
            throw error;
        }
    }
}

module.exports = new SupportStatusService();

