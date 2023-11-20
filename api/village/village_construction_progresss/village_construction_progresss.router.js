const express = require('express');
const router = express.Router();
const VillageUnitController = require('./village_construction_progresss.controller');
const { 
    isAdmin 
} = require('../../../middlewares/auth');
const { 
    idParamSanitization, 
    createNewBuildingSanitization, 
    createUpdateBuildingSanitization, 
    updateSanitization 
} = require('./village_construction_progresss.sanitization'); 

/**
 * Auth routes
 */
router.get('/', VillageUnitController.getAll);
router.get('/:id', idParamSanitization, VillageUnitController.get);
router.put('/cancel/:id', idParamSanitization, VillageUnitController.cancelConstruction);

/**
 * Admin routes
 */
router.post('/new', isAdmin, createNewBuildingSanitization, VillageUnitController.createNewBuilding);
router.post('/update', isAdmin, createUpdateBuildingSanitization, VillageUnitController.createUpdateBuilding);
router.put('/:id', isAdmin, updateSanitization, VillageUnitController.update);
router.delete('/:id', isAdmin, idParamSanitization, VillageUnitController.delete);

module.exports = router;