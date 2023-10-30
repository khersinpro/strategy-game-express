const express = require('express');
const router = express.Router();
const VillageUpdateConstructionController = require('./village_update_construction.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { idParamSanitization, createSanitization, updateSanitization } = require('./village_update_construction.sanitization'); 
/**
 * Auth routes
 */
router.get('/', VillageUpdateConstructionController.getAll);
router.get('/:id', idParamSanitization, VillageUpdateConstructionController.get);

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, VillageUpdateConstructionController.create);
router.put('/:id', isAdmin, updateSanitization, VillageUpdateConstructionController.update);
router.delete('/:id', isAdmin, idParamSanitization, VillageUpdateConstructionController.delete);

module.exports = router;