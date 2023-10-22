const express = require('express');
const router = express.Router();
const VillagebuildingController = require('./village_building.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { idParamSanitization, createSanitization, updateSanitization } = require('./village_building.sanitization');

/**
 * Auth routes
 */
router.get('/', VillagebuildingController.getAll);
router.get('/:id', idParamSanitization, VillagebuildingController.get);

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, VillagebuildingController.create);
router.put('/:id', isAdmin, updateSanitization, VillagebuildingController.update);
router.delete('/:id', isAdmin, idParamSanitization, VillagebuildingController.delete);

module.exports = router;