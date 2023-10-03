const express = require('express');
const router = express.Router();
const SpecialBuildingController = require('./special_building.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { nameParamSanitization, createSanitization, updateSanitization } = require('./special_building.sanitization')

/**
 * Auth routes
 */
router.get('/', SpecialBuildingController.getAll);
router.get('/:name', nameParamSanitization, SpecialBuildingController.get);

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, SpecialBuildingController.create);
router.put('/:name', isAdmin, updateSanitization, SpecialBuildingController.update);
router.delete('/:name', isAdmin, nameParamSanitization, SpecialBuildingController.delete);

module.exports = router;