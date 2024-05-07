const PopulcationCapacityService = require('./population_capaticity.service')

class PopulcationCapacityController {
    /**
     * Return all population capacities
     */
    async getAll(req, res, next) {
        try {
            const populationCapacities = await PopulcationCapacityService.getAll()
            res.status(200).json(populationCapacities)
        }   
        catch (error) {
            next(error)
        }
    }

    /**
     * Return all population capacities with included building level by building name
     * 
     * @param {string} buildingName - The name of the building
     */
    async getAllWithLevelByBuildingName(req, res, next) {
        try {
            const populationCapacities = await PopulcationCapacityService.getAllWithLevelByBuildingName(req.params.buildingName)
            res.status(200).json(populationCapacities)
        }
        catch (error) {
            next(error)
        }
    }

    /**
     * Return a population capacity by id
     * 
     * @param {number} id - The id of the population capacity
     */
    async getById(req, res, next) {
        try {
            const populationCapacity = await PopulcationCapacityService.getById(req.params.id)
            res.status(200).json(populationCapacity)
        }
        catch (error) {
            next(error)
        }
    }

    /**
     * Create a population capacity
     * 
     * @param {Object} data - The data of the population capacity
     */
    async create(req, res, next) {
        try {
            const populationCapacity = await PopulcationCapacityService.create(req.body)
            res.status(201).json(populationCapacity)
        }
        catch (error) {
            next(error)
        }
    }

    /**
     * Update a population capacity
     * 
     * @param {number} id - The id of the population capacity
     * @param {Object} data - The data of the population capacity
     */
    async update(req, res, next) {
        try {
            const populationCapacity = await PopulcationCapacityService.update(req.params.id, {
                capacity: req.body.capacity
            })
            res.status(200).json(populationCapacity)
        }
        catch (error) {
            next(error)
        }
    }

    /**
     * Delete a population capacity
     * 
     * @param {number} id - The id of the population capacity
     */
    async deletePopulationCapacity(req, res, next) {
        try {
            await PopulcationCapacityService.delete(req.params.id)
            res.status(204).end()
        }
        catch (error) {
            next(error)
        }
    }
}

module.exports = new PopulcationCapacityController()