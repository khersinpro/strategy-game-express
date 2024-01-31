const NotFoundError = require('../../errors/not-found');
const attackService = require('../attack/attack.service');
const VillageService = require('./village.service');
const villageBuildingService = require('./village_building/village_building.service');
const VillageResourceService = require('./village_resource/village_resource.service');
const villageUnitService = require('./village_unit/village_unit.service');
const VillageUpdateUtils = require('../../utils/villlageUpdateUtils');

class VillageController {

    /**
     * Returns all villages
     * @param req.query.resources - If true, returns the village resources
     * @param req.query.buildings - If true, returns the village buildings
     * @param req.query.units - If true, returns the village units
     * @param req.query.server - If true, returns the village server
     * @param req.query.user - If true, returns the village user
     * @param req.query.civilization - If true, returns the village civilization
     */
    async getAll(req, res, next) {
        try {
            /**
             * A retirer par la suite
            */
            // await VillageResourceService.updateAllVillagesResources();
            // await villageBuildingService.updateAllVillageBuildingWhenConstructionProgressIsFinished();
            // await villageBuildingService.createAllVillageBuildingWhenConstructionProgressIsFinished();
            // await villageUnitService.addUnitAfterTraining();
            /**
             * A retirer par la suite
             */
            const villages = await VillageService.getAll(req.query, {}, req.user);
            res.status(200).send(villages);
        }
        catch (error) 
        {
            next(error);
        }    
    }

    /**
     * Find a village by id and returns it
     * @param req.query.resources - If true, returns the village resources
     * @param req.query.buildings - If true, returns the village buildings
     * @param req.query.units - If true, returns the village units
     * @param req.query.server - If true, returns the village server
     * @param req.query.user - If true, returns the village user
     * @param req.query.civilization - If true, returns the village civilization
     */
    async get(req, res, next) {
        try 
        {
            await VillageUpdateUtils.updateVillageData(req.params.id);
            const village = await VillageService.getById(req.params.id, req.query, {}, req.user);  
            res.status(200).send(village);
        }
        catch (error)
        {
            next(error);
        }
    }

    /** 
     * Creates a new village and returns it
     */ 
    async create(req, res, next) {
        try 
        {
            const village = await VillageService.create(req.user, req.body);
            res.status(201).send(village);
        }
        catch (error)
        {
            console.error(error)
            next(error);
        }
    }

    /**
     * Updates a village
     */ 
    async update(req, res, next) {
        try 
        {
            const village = await VillageService.update(req.params.id, req.body, req.user);
            res.status(200).send(village);
        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Deletes a village
     */ 
    async delete(req, res, next) {
        try 
        {
            const village = await VillageService.delete(req.params.id);
            res.status(200).send(village);
        }
        catch (error)
        {
            next(error);
        }
    }
}

module.exports = new VillageController();