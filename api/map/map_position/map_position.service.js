const NotFoundError = require('../../../errors/not-found');
const Map_position  = require('../../../database/models/map_position');

class MapPositionService {
    /**
     *  Returns all map_positions into promise
     * @returns {Promise<Map_position[]>}
     */
    getAll() {
        return Map_position.findAll();
    }

    /**
     * Returns a Map_position by its id
     * @param {number} id
     * @throws {NotFoundError} if Map_position not found
     * @returns {Promise<Map_position>}
     */
    async getById(id) {
        try 
        {
            const mapPositon = await Map_position.findByPk(id);

            if (!mapPositon) 
            {
                throw new NotFoundError(`Map_position with id ${id} not found.`);
            }

            return mapPositon;
        }
        catch (error) 
        {
            throw error;
        }
    }

    /**
     * Returns created Map_position promise
     * @param {Object} data
     * @returns {Promise<Map_position>}
     */
    create(data) {
        return Map_position.create(data);
    }

    /**
     * Returns updated Map_position promise
     * @param {number} id - Map_position id
     * @param {Object} data - Map_position data
     * @returns {Promise<[number, Map_position[]]>}
     */
    update(id, data) {
        return Map_position.update(data, {
            where: { id }
        });
    }

    /**
     * Returns deleted Map_position promise
     * @param {number} id
     * @returns {Promise<number>}
     */
    async delete(id) {
        try 
        {
            const mapPositon = await this.getById(id);
            return mapPositon.destroy();
        }
        catch (error) 
        {
            throw error;
        }
    }
}

module.exports = new MapPositionService();