const express = require('express');
const router = express.Router();
const TownAllBuildingController = require('./town_all_building.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { nameParamSanitization, createSanitization, updateSanitization } = require('./town_all_building.sanitization')

/**
 * Auth routes
 */
router.get('/', TownAllBuildingController.getAll);
router.get('/:name', nameParamSanitization, TownAllBuildingController.get);

/**
 * Admin routes
 */ 
router.post('/', isAdmin, createSanitization, TownAllBuildingController.create);
router.put('/:name', isAdmin, updateSanitization, TownAllBuildingController.update);
router.delete('/:name', isAdmin, nameParamSanitization, TownAllBuildingController.delete);


module.exports = router;