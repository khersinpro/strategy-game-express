const express = require('express');
const router = express.Router();
const BuildingTypeController = require('./building_type.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { 
    nameParamSanitization, 
    createSanitization, 
    updateSanitization 
} = require('./building_type.sanitization')

/**
 * Auth routes
 */
router.get('/', BuildingTypeController.getAll);
router.get('/:name', nameParamSanitization, BuildingTypeController.get);

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, BuildingTypeController.create);
router.put('/:name', isAdmin, updateSanitization, BuildingTypeController.update);
router.delete('/:name', isAdmin, nameParamSanitization, BuildingTypeController.delete);

module.exports = router;