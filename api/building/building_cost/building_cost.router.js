const express = require('express');
const router = express.Router();
const BuildingCostController = require('./building_cost.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { idParamSanitization, createSanitization, updateSanitization } = require('./building_cost.sanitization')

/**
 * Auth routes
 */
router.get('/', BuildingCostController.getAll);
router.get('/:id', idParamSanitization, BuildingCostController.get);

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, BuildingCostController.create);
router.put('/:id', isAdmin, updateSanitization, BuildingCostController.update);
router.delete('/:id', isAdmin, idParamSanitization, BuildingCostController.delete);

module.exports = router;