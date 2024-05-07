const express = require('express');
const router = express.Router();
const ResourceProductionController = require('./resource_production.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { idParamSanitization, createSanitization, updateSanitization } = require('./resource_production.sanitization');
const { nameParamSanitization } = require('../building.sanitization');

/*************************************************
 * Auth routes
 *************************************************/
router.get('/:id', idParamSanitization, ResourceProductionController.get);
router.get('/levels/:name', nameParamSanitization, ResourceProductionController.getAllWithLevelByBuildingName);

/*************************************************
 * Admin routes
*************************************************/
router.get('/', ResourceProductionController.getAll);
router.post('/', isAdmin, createSanitization, ResourceProductionController.create);
router.put('/:id', isAdmin, updateSanitization, ResourceProductionController.update);
router.delete('/:id', isAdmin, idParamSanitization, ResourceProductionController.delete);

module.exports = router;