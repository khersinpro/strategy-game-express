const express = require('express');
const router = express.Router();
const AttackStatusController = require('./attack_status.controller');
const { 
    isAdmin 
} = require('../../../middlewares/auth');
const { 
    createSanitization, 
    updateSanitization, 
    nameParamSanitization
} = require('./attack_status.sanitization');


/**
 * Auth routes
 */
router.get('/',  AttackStatusController.getAll);
router.get('/:name', nameParamSanitization, AttackStatusController.getById);

/**
 * Admin routes
*/
router.post('/', isAdmin, createSanitization, AttackStatusController.create);
router.put('/:name', isAdmin, nameParamSanitization, updateSanitization, AttackStatusController.update);
router.delete('/:name', isAdmin, nameParamSanitization, AttackStatusController.delete);

module.exports = router;