const express = require('express');
const router = express.Router();
const AttackAttackerUnitController = require('./attack_attacker_unit.controller');
const { 
    isAdmin 
} = require('../../../middlewares/auth');
const { 
    createSanitization, 
    updateSanitization, 
    idParamSanitization 
} = require('./attack_attacker_unit.sanitization');


/**
 * Auth routes
 */
router.get('/', AttackAttackerUnitController.getAll);
router.get('/:id', idParamSanitization, AttackAttackerUnitController.getById);
router.post('/', createSanitization, AttackAttackerUnitController.create);
router.put('/:id', idParamSanitization, updateSanitization, AttackAttackerUnitController.update);

/**
 * Admin routes
 */
router.delete('/:id', isAdmin, idParamSanitization, AttackAttackerUnitController.delete);

module.exports = router;