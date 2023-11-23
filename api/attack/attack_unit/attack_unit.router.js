const express = require('express');
const router = express.Router();
const AttackUnitController = require('./attack_unit.controller');
const { 
    isAdmin 
} = require('../../../middlewares/auth');
const { 
    createSanitization, 
    updateSanitization, 
    idParamSanitization 
} = require('./attack_unit.sanitization');


/**
 * Auth routes
 */
router.get('/', AttackUnitController.getAll);
router.get('/:id', idParamSanitization, AttackUnitController.getById);
router.post('/', createSanitization, AttackUnitController.create);
router.put('/:id', idParamSanitization, updateSanitization, AttackUnitController.update);

/**
 * Admin routes
 */
router.delete('/:id', isAdmin, idParamSanitization, AttackUnitController.delete);

module.exports = router;