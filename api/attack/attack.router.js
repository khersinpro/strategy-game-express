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
} = require('./attack.sanitization');


/**
 * Auth routes
 */
router.get('/',  AttackController.getAll);
router.get('/:id', idParamSanitization, AttackController.getById);
router.get('/village/:id', idParamSanitization, AttackController.generateIncomingAttackResults);
router.post('/', createSanitization, AttackController.create);
router.post('/generate', AttackController.generate);
router.post('/simulate', AttackController.attackSimulation);
router.put('/:id', idParamSanitization, updateSanitization, AttackController.update);
/**
 * Admin routes
 */
router.delete('/:id', isAdmin, idParamSanitization, AttackController.delete);

module.exports = router;