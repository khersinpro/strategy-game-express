const MapPositionService = require('./map_position.service');

class MapPositionController {
    /**
     * Returns all map_positions
     */
    async getAll (req, res, next) {
        try {
            const maps = await MapPositionService.getAll();
            res.status(200).json(maps);
        }
        catch (error) {
            next(error);
        }
    }

    /**
     * Returns a map_position by its id
     * @param {number} req.params.id - map_position id
     */
    async getById (req, res, next) {
        try {
            const map = await MapPositionService.getById(req.params.id);
            res.status(200).json(map_position);
        }
        catch (error) {
            next(error);
        }
    }

    /**
     * Returns created map_position
     * @param {Object} req.body - map_position data
     */
    async create (req, res, next) {
        try {
            const map = await MapPositionService.create(req.body);
            res.status(201).json(map);
        }
        catch (error) {
            next(error);
        }
    }

    /**
     * Returns updated map_position
     * @param {number} req.params.id - map_position id
     * @param {Object} req.body - map_position data
     */
    async update (req, res, next) {
        try {
            const map = await MapPositionService.update(req.params.id, req.body);
            res.status(200).json(map);
        }
        catch (error) {
            next(error);
        }
    }

    /**
     * Returns deleted map_position
     * @param {number} req.params.id - map_position id
     */ 
    async delete (req, res, next) {
        try {
            const map = await MapPositionService.delete(req.params.id);
            res.status(200).json(map);
        }
        catch (error) {
            next(error);
        }
    }

}

module.exports = new MapPositionController();