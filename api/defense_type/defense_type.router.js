const express = require('express');
const router = express.Router();
const DefenseTypeController = require('./defense_type.controller');
const { isAdmin } = require('../../middlewares/auth');
const { nameParamSanitization, typeParamSanitization, createSanitization, updateSanitization } = require('./defense_type.sanitization');


/**
 * Auth routes
 */
router.get('/', DefenseTypeController.getAll);
router.get('/:unitname', DefenseTypeController.getByUnitName);
router.get('/:unitname/:type', DefenseTypeController.getByUnitNameAndType);

/**
 * Admin routes
 */
router.post('/', isAdmin, DefenseTypeController.create);
router.put('/:unitname/:type', isAdmin, DefenseTypeController.update);
router.delete('/:unitname/:type', isAdmin, DefenseTypeController.delete);

module.exports = router;