const BuildingTypeService = require('./building_type.service');

class BuildingTypeController {
    
    /**
     * get all building types
     */
    async getAll (req, res, next) {
        try
        {
            const buildingTypes = await BuildingTypeService.getAll();
            res.status(200).json(buildingTypes);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a building name by name
     * @param {String} req.params.name - name of the building name
     */
    async get (req, res, next) {
        try
        {
            const buildingType = await BuildingTypeService.getByName(req.params.name);
            res.status(200).json(buildingType);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a building name
     */
    async create (req, res, next) {
        try
        {
            const buildingType = await BuildingTypeService.create(req.body);
            res.status(201).json(buildingType);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a building name
     * @param {String} req.params.name - name of the building name
     */ 
    async update (req, res, next) {
        try
        {
            const buildingType = await BuildingTypeService.update(req.params.name, req.body);
            res.status(200).json(buildingType);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a building name
     * @param {String} req.params.name - name of the building name
     */
    async delete (req, res, next) {
        try
        {
            await BuildingTypeService.delete(req.params.name);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new BuildingTypeController();