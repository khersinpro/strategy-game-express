const VillageConstructionProgressService = require('./village_construction_progresss.service');
class VillageUnitController {
    
    /**
     * get all village_construction_progresss 
     */
    async getAll (req, res, next) {
        try
        {
            const villageConstructionProgresses = await VillageConstructionProgressService.getAll();
            res.status(200).json(villageConstructionProgresses);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * get a village_construction_progresss by id
     */
    async get (req, res, next) {
        try
        {
            const villageConstructionProgress = await VillageConstructionProgressService.getById(req.params.id);
            res.status(200).json(villageConstructionProgress);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a village_construction_progresss with type village_new_construction
     * @param req.body.village_id id of the village
     * @param req.body.building_name name of the building to be constructed
     */
    async createNewBuilding (req, res, next) {
        try
        {
            const villageConstructionProgress = await VillageConstructionProgressService.createNewConstructionProgress(req.body, req.user);
            res.status(201).json(villageConstructionProgress);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * create a village_construction_progresss with type village_update_construction
     * @param req.body.village_id id of the village
     * @param req.body.village_building_id id of the village_building to be updated
     */
    async createUpdateBuilding (req, res, next) {
        try
        {
            const villageConstructionProgress = await VillageConstructionProgressService.createUpdateConstructionProgress(req.body, req.user);
            res.status(201).json(villageConstructionProgress);
        }
        catch (error)
        {
            console.log(error);
            next(error)
        }
    }

    /**
     * update a village_construction_progresss
     */ 
    async update (req, res, next) {
        try
        {
            const villageConstructionProgress = await VillageConstructionProgressService.update(req.params.id, req.body);
            res.status(200).json(villageConstructionProgress);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * delete a village_construction_progresss
     */
    async delete (req, res, next) {
        try
        {
            await VillageConstructionProgressService.delete(req.params.id);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * cancel a village_construction_progresss
     */
    async cancelConstruction (req, res, next) {
        try
        {
            await VillageConstructionProgressService.cancelConstructionProgress(req.params.id, req.user);
            res.status(204).end();
        }
        catch (error)
        {
            next(error)
        }
    }
}

module.exports = new VillageUnitController();