const express = require('express');
const router = express.Router();
const AttackController = require('./attack.controller');
const { 
    isAdmin 
} = require('../../middlewares/auth');
const { 
    createSanitization, 
    updateSanitization, 
    idParamSanitization,
    generateSanitization 
} = require('./attack.sanitization');


/**
 * Auth routes
 */
router.get('/',  AttackController.getAll);
router.get('/:id', idParamSanitization, AttackController.getById);
router.get('/village/:id', idParamSanitization, AttackController.handleIncommingAttacks);
router.post('/generate', generateSanitization, AttackController.generate);
/**
 * Admin routes
*/
router.post('/simulate', isAdmin, AttackController.attackSimulation);
router.put('/:id', isAdmin, idParamSanitization, updateSanitization, AttackController.update);
router.post('/', isAdmin, createSanitization, AttackController.create);
router.delete('/:id', isAdmin, idParamSanitization, AttackController.delete);

module.exports = router;