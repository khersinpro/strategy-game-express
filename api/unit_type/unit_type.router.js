const express = require('express');
const router = express.Router();
const unitTypeController = require('./unit_type.controller');
const { createSanitization, updateSanitization, typeParamSanitization } = require('./unit_type.sanitization');
const { isAdmin } = require('../../middlewares/auth');


/**
 * Auth routes
 */
router.get('/', unitTypeController.getAll);
router.get('/:type', typeParamSanitization, unitTypeController.get);

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, unitTypeController.create);
router.put('/:type', isAdmin, updateSanitization, unitTypeController.update);
router.delete('/:type', isAdmin, typeParamSanitization, unitTypeController.delete);

module.exports = router;