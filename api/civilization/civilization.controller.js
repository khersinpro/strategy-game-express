const NotFoundError = require('../../errors/not-found');
const CivilizationService = require('./civilization.service');

class CivilizationController {
    /**
     * Get all civilizations
     */
    async getAll(req, res, next) {
        try
        {
            const civilizations = await CivilizationService.getAll()
            res.status(200).json(civilizations)
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * Get civilization by its name
     * @throws {NotFoundError} if the civilization does not exist
     */
    async get(req, res, next) {
        try
        {
            const name = req.params.name

            const civilization = await CivilizationService.getByName(name)

            if (!civilization)
            {
                throw new NotFoundError('Civilization not found')
            }

            res.status(200).json(civilization)
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * Create a civilization
     */
    async create(req, res, next) {
        try
        {
            const data = req.body

            const civilization = await CivilizationService.create(data)
            res.status(201).json(civilization)
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * Update a civilization
     */
    async update(req, res, next) {
        try
        {
            const name = req.params.name
            const data = req.body

            await CivilizationService.update(name, data)

            res.status(204).end()
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * Delete a civilization
     */
    async delete(req, res, next) {
        try
        {
            const name = req.params.name

            await CivilizationService.delete(name)

            res.status(204).end()
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new CivilizationController();