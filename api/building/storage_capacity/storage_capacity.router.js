const express = require('express');
const router = express.Router();
const StorageCapacityController = require('./storage_capacity.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { idParamSanitization, createSanitization, updateSanitization } = require('./storage_capacity.sanitization');
const { nameParamSanitization } = require('../building.sanitization');

/*************************************************
 * Auth routes
 *************************************************/
router.get('/:id', idParamSanitization, StorageCapacityController.get);
router.get('/levels/:name', nameParamSanitization, StorageCapacityController.getAllWithLevelByBuildingName);

/*************************************************
 * Admin routes
*************************************************/
router.get('/', StorageCapacityController.getAll);
router.post('/', isAdmin, createSanitization, StorageCapacityController.create);
router.put('/:id', isAdmin, updateSanitization, StorageCapacityController.update);
router.delete('/:id', isAdmin, idParamSanitization, StorageCapacityController.delete);


module.exports = router;