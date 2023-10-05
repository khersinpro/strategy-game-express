const InfrastructureBuildingService = require('./infrastructure_building.service');

class InfrastructureBuildingController {
     /**
     * get all infrastructure buildings
     */
     async getAll (req, res, next) {
        try
        {
            const infrastructureBuildings = await InfrastructureBuildingService.getAll();
            res.status(200).json(infrastructureBuildings);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a infrastructure building by name
     */
    async get (req, res, next) {
        try
        {
            const infrastructureBuilding = await InfrastructureBuildingService.getByName(req.params.name);
            res.status(200).json(infrastructureBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a infrastructure building
     */
    async create (req, res, next) {
        try
        {
            const infrastructureBuilding = await InfrastructureBuildingService.create(req.body);
            res.status(201).json(infrastructureBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * update a infrastructure building
     */ 
    async update (req, res, next) {
        try
        {
            const infrastructureBuilding = await InfrastructureBuildingService.update(req.params.name, req.body);
            res.status(200).json(infrastructureBuilding);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a infrastructure building
     */
    async delete (req, res, next) {
        try
        {
            await InfrastructureBuildingService.delete(req.params.name);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new InfrastructureBuildingController();