const express = require('express');
const router = express.Router();
const DefenseTypeController = require('./defense_type.controller');
const { isAdmin } = require('../../middlewares/auth');
const { nameParamSanitization, typeParamSanitization, createSanitization, updateSanitization } = require('./defense_type.sanitization');


/**
 * Auth routes
 */
router.get('/', DefenseTypeController.getAll);
router.get('/:unitname', nameParamSanitization, DefenseTypeController.getByUnitName);
router.get('/:unitname/:type', nameParamSanitization, typeParamSanitization, DefenseTypeController.getByUnitNameAndType);

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, DefenseTypeController.create);
router.put('/:unitname/:type', isAdmin, updateSanitization, DefenseTypeController.update);
router.delete('/:unitname/:type', isAdmin, nameParamSanitization, typeParamSanitization, DefenseTypeController.delete);

module.exports = router;