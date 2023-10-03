const express = require('express');
const router = express.Router();
const BuildingController = require('./building.controller');
const { isAdmin } = require('../../middlewares/auth');
const { nameParamSanitization, createSanitization, updateSanitization } = require('./building.sanitization')

/**
 * Auth routes
 */
router.get('/', BuildingController.getAll);
router.get('/:name', nameParamSanitization, BuildingController.get);

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, BuildingController.create);
router.put('/:name', isAdmin, updateSanitization, BuildingController.update);
router.delete('/:name', isAdmin, nameParamSanitization, BuildingController.delete);

module.exports = router;