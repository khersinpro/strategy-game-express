const express = require('express');
const router = express.Router();
const VillageUnitController = require('./village_unit.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { idParamSanitization, createSanitization, updateSanitization } = require('./village_unit.sanitization'); 
/**
 * Auth routes
 */
router.get('/', VillageUnitController.getAll);
router.get('/:id', idParamSanitization, VillageUnitController.get);

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, VillageUnitController.create);
router.put('/:id', isAdmin, updateSanitization, VillageUnitController.update);
router.delete('/:id', isAdmin, idParamSanitization, VillageUnitController.delete);

module.exports = router;