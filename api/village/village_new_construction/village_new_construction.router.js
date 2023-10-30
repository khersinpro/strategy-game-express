const express = require('express');
const router = express.Router();
const VillageNewConstructionController = require('./village_new_construction.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { idParamSanitization, createSanitization, updateSanitization } = require('./village_new_construction.sanitization'); 
/**
 * Auth routes
 */
router.get('/', VillageNewConstructionController.getAll);
router.get('/:id', idParamSanitization, VillageNewConstructionController.get);

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, VillageNewConstructionController.create);
router.put('/:id', isAdmin, updateSanitization, VillageNewConstructionController.update);
router.delete('/:id', isAdmin, idParamSanitization, VillageNewConstructionController.delete);

module.exports = router;