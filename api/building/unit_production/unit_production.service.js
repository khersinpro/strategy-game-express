const Building_level = require('../../../database/models/building_level')
const Unit_production = require('../../../database/models/unit_production')

class UnitProductionService {
    /**
     * Get all unit productions 
     * 
     * @returns {Promise<Unit_production[]>}
     */
    getAll() { 
        return Unit_production.findAll()
    }

    /**
     * Get all unit productions and their building level by building name
     * 
     * @param {string} name - The name of the building
     * @returns {Promise<Unit_production[]>}
     */
    getAllWithLevelByBuildingName(name) {
        return Unit_production.findAll({
            where: { military_building_name: name },
            include: {
                model: Building_level,
                as: 'building_level'
            },
            order: [
                ['building_level', 'level', 'ASC']
            ]
        })
    }

    /**
     * Get a unit production by id
     * 
     * @param {number} id - The id of the unit production
     * @returns {Promise<Unit_production>}
     */ 
    async getById(id) {
        try {
            const unitProduction = await Unit_production.findByPk(id)

            if (!unitProduction) {
                throw new NotFoundError(`The unit production with id ${id} was not found`)
            }

            return unitProduction
        }
        catch (error) {
            throw error
        }
    }

    /**
     * Create a unit production
     * 
     * @param {Object} data - The data of the unit production
     * @returns {Promise<Unit_production>}
     */
    create(data) {
        return Unit_production.create(data)
    }

    /**
     * Update a unit production
     * 
     * @param {number} id - The id of the unit production
     * @param {Object} data - The data of the unit production
     * @returns {Promise<[number, Unit_production[]]>}
     */
    update(id, data) {
        return Unit_production.update(data, {
            where: { id }
        })
    }

    /**
     * Delete a unit production
     * 
     * @param {number} id - The id of the unit production
     * @returns {Promise<number>}
     */
    delete(id) {
        return Unit_production.destroy({
            where: { id }
        })
    }
}

module.exports = new UnitProductionService()