const NotFoundError = require('../../errors/not-found');
const Map           = require('../../database/models/map');

class MapService {
    /**
     *  Returns all maps into promise
     * @returns {Promise<Map[]>}
     */
    getAll() {
        return Map.findAll();
    }

    /**
     * Returns a map by its id
     * @param {number} id
     * @throws {NotFoundError} if map not found
     * @returns {Promise<Map>}
     */
    async getById(id) {
        try 
        {
            const map = await Map.findByPk(id);

            if (!map) 
            {
                throw new NotFoundError(`Map with id ${id} not found.`);
            }

            return map;
        }
        catch (error) 
        {
            throw error;
        }
    }

    /**
     * Returns created map promise
     * @param {Object} data
     * @returns {Promise<Map>}
     */
    async create(data) {
        try
        {
            const newMap = await Map.create(data);

            await newMap.generateMapPositions();

            return newMap;
        }
        catch (error)
        {
            throw error;
        }
    }

    /**
     * Returns updated map promise
     * @param {number} id
     * @param {Object} data
     * @returns {Promise<[number, Map[]]>}
     */
    update(id, data) {
        return Map.update(data, {
            where: { id }
        });
    }

    /**
     * Returns deleted map promise
     * @param {number} id
     * @returns {Promise<number>}
     */
    async delete(id) {
        try 
        {
            const map = await this.getById(id);
            return map.destroy();
        }
        catch (error) 
        {
            throw error;
        }
    }
}

module.exports = new MapService();