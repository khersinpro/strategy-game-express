const express = require('express');
const router = express.Router();
const UnitCostController = require('./unit_cost.controller');
const { 
    isAdmin 
} = require('../../../middlewares/auth');
const { 
    idParamSanitization, 
    createSanitization, 
    updateSanitization 
} = require('./unit_cost.sanitization')

/**
 * Auth routes
 */
router.get('/', UnitCostController.getAll);
router.get('/:id', idParamSanitization, UnitCostController.get);

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, UnitCostController.create);
router.put('/:id', isAdmin, updateSanitization, UnitCostController.update);
router.delete('/:id', isAdmin, idParamSanitization, UnitCostController.delete);

module.exports = router;