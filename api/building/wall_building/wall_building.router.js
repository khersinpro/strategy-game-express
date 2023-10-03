const express = require('express');
const router = express.Router();
const WallBuildingController = require('./wall_building.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { nameParamSanitization, createSanitization, updateSanitization } = require('./wall_building.sanitization')

/**
 * Auth routes
 */
router.get('/', WallBuildingController.getAll);
router.get('/:name', nameParamSanitization, WallBuildingController.get);

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, WallBuildingController.create);
router.put('/:name', isAdmin, updateSanitization, WallBuildingController.update);
router.delete('/:name', isAdmin, nameParamSanitization, WallBuildingController.delete);

module.exports = router;