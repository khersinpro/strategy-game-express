const express = require('express');
const router = express.Router();
const StorageBuildingController = require('./storage_building.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { nameParamSanitization, createSanitization, updateSanitization } = require('./storage_building.sanitization')

/**
 * Auth routes
 */
router.get('/', StorageBuildingController.getAll);
router.get('/:name', nameParamSanitization, StorageBuildingController.get);

/**
 * Admin routes
 */ 
router.post('/', isAdmin, createSanitization, StorageBuildingController.create);
router.put('/:name', isAdmin, updateSanitization, StorageBuildingController.update);
router.delete('/:name', isAdmin, nameParamSanitization, StorageBuildingController.delete);


module.exports = router;