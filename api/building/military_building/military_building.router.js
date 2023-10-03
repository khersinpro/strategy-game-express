const express = require('express');
const router = express.Router();
const MilitaryBuildingController = require('./military_building.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { nameParamSanitization, createSanitization, updateSanitization } = require('./military_building.sanitization')

/**
 * Auth routes
 */
router.get('/', MilitaryBuildingController.getAll);
router.get('/:name', nameParamSanitization, MilitaryBuildingController.get);

/**
 *  Admin routes
 */
router.post('/', isAdmin, createSanitization, MilitaryBuildingController.create);
router.put('/:name', isAdmin, updateSanitization, MilitaryBuildingController.update);
router.delete('/:name', isAdmin, nameParamSanitization, MilitaryBuildingController.delete);

module.exports = router;