const express = require('express');
const router = express.Router();
const VillageResourceController = require('./village_resource.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { idParamSanitization, createSanitization, updateSanitization } = require('./village_resource.sanitization');

/**
 * Auth routes
 */
router.get('/', VillageResourceController.getAll);
router.get('/:id', idParamSanitization, VillageResourceController.get);

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, VillageResourceController.create);
router.put('/:id', isAdmin, updateSanitization, VillageResourceController.update);
router.delete('/:id', isAdmin, idParamSanitization, VillageResourceController.delete);

module.exports = router;