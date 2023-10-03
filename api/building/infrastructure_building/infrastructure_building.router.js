const express = require('express');
const router = express.Router();
const InfrastructureBuildingController = require('./infrastructure_building.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { nameParamSanitization, createSanitization, updateSanitization } = require('./infrastructure_building.sanitization')

/**
 * Auth routes
 */
router.get('/', InfrastructureBuildingController.getAll);
router.get('/:name', nameParamSanitization, InfrastructureBuildingController.get);

/**
 * Admin routes
 */ 
router.post('/', isAdmin, createSanitization, InfrastructureBuildingController.create);
router.put('/:name', isAdmin, updateSanitization, InfrastructureBuildingController.update);
router.delete('/:name', isAdmin, nameParamSanitization, InfrastructureBuildingController.delete);


module.exports = router;