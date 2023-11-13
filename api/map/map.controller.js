const MapService = require('./map.service');

class MapController {
    /**
     * Returns all maps
     */
    async getAll (req, res, next) {
        try {
            const maps = await MapService.getAll();
            res.status(200).json(maps);
        }
        catch (error) {
            next(error);
        }
    }

    /**
     * Returns a map by its id
     * @param {number} req.params.id - Map id
     */
    async getById (req, res, next) {
        try {
            const map = await MapService.getById(req.params.id);
            res.status(200).json(map);
        }
        catch (error) {
            next(error);
        }
    }

    /**
     * Returns created map
     * @param {Object} req.body - Map data
     */
    async create (req, res, next) {
        try {
            const map = await MapService.create(req.body);
            res.status(201).json(map);
        }
        catch (error) {
            next(error);
        }
    }

    /**
     * Returns updated map
     * @param {number} req.params.id - Map id
     * @param {Object} req.body - Map data
     */
    async update (req, res, next) {
        try {
            const map = await MapService.update(req.params.id, req.body);
            res.status(200).json(map);
        }
        catch (error) {
            next(error);
        }
    }

    /**
     * Returns deleted map
     * @param {number} req.params.id - Map id
     */ 
    async delete (req, res, next) {
        try {
            const map = await MapService.delete(req.params.id);
            res.status(200).json(map);
        }
        catch (error) {
            next(error);
        }
    }

}

module.exports = new MapController();