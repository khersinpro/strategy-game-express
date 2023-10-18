const express = require('express');
const router = express.Router();
const BuildingLevelController = require('./building_level.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { idParamSanitization, createSanitization, updateSanitization } = require('./building_level.sanitization')

/**
 * Auth routes
 */
router.get('/', BuildingLevelController.getAll);
router.get('/:id', idParamSanitization, BuildingLevelController.get);

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, BuildingLevelController.create);
router.put('/:id', isAdmin, updateSanitization, BuildingLevelController.update);
router.delete('/:id', isAdmin, idParamSanitization, BuildingLevelController.delete);

module.exports = router;