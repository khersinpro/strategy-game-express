const express = require('express');
const router = express.Router();
const AttackController = require('./attack.controller');
const { 
    isAdmin 
} = require('../../middlewares/auth');
const { 
    createSanitization, 
    updateSanitization, 
    idParamSanitization 
} = require('./attack_status.sanitization');


/**
 * Auth routes
 */
router.get('/',  AttackController.getAll);
router.get('/:id', idParamSanitization, AttackController.getById);
router.post('/', createSanitization, AttackController.create);
router.put('/:id', idParamSanitization, updateSanitization, AttackController.update);

/**
 * Admin routes
 */
router.delete('/:id', isAdmin, idParamSanitization, AttackController.delete);

module.exports = router;