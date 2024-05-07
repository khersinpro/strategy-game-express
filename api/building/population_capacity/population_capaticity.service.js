const Population_capacity = require('../../../database/models/population_capacity')
const Building_level = require('../../../database/models/building_level')
const NotFoundError = require('../../../errors/not-found')

class PopulationCapacityService {
    /**
     * Return all population capacities
     * 
     * @returns {Promise<Population_capacity[]>}
     */
    getAll() {
        return Population_capacity.findAll()
    }

    /**
     * Return all population capacities with included building level by building name
     * 
     * @param {string} buildingName - The name of the building
     * @returns {Promise<Population_capacity[]>}
     */
    getAllWithLevelByBuildingName(buildingName) {
        return Population_capacity.findAll({
            include: Building_level,
            where: {
                town_all_building_name: buildingName
            },
            order: [
                [Building_level, 'level', 'ASC']
            ]
        })
    }

    /**
     * Return a population capacity by id
     * 
     * @param {number} id - The id of the population capacity
     * @throws {NotFoundError} When the population capacity is not found
     * @returns {Promise<Population_capacity>}
     */
    async getById(id) {
        try {
            const populationCapacity = await Population_capacity.findByPk(id)

            if (!populationCapacity) {
                throw new NotFoundError(`The population capacity with id ${id} was not found`)
            }

            return populationCapacity
        }
        catch (error) { 
            throw error
        }
    }

    /**
     * Create a population capacity
     * 
     * @param {Object} data - The data of the population capacity
     * @returns {Promise<Population_capacity>}
     */
    create(data) {
        return Population_capacity.create(data)
    }


    /**
     * Update a population capacity
     * 
     * @param {number} id - The id of the population capacity
     * @param {Object} data - The data of the population capacity
     * @returns {Promise<Population_capacity>}
     */
    update(id, data) {
        return Population_capacity.update(data, {
            where: {
                id: id
            }
        })
    }

    /**
     * Delete a population capacity
     * 
     * @param {number} id - The id of the population capacity
     * @returns {Promise<Population_capacity>}
     */ 
    delete(id) {
        return Population_capacity.destroy({
            where: {
                id: id
            }
        })
    }
}

module.exports = new PopulationCapacityService()