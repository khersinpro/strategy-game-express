const express = require('express');
const router = express.Router();
const SupportingUnitController = require('./supporting_unit.controller');
const { idParamSanitization, createSanitization, updateSanitization } = require('./supporting_unit.sanitization');
const { isAdmin } = require('../../../middlewares/auth')

/**
 * Only admin can access the following routes
 */
router.get('/', isAdmin, SupportingUnitController.getAllSupportingUnits);
router.get('/:id', isAdmin, idParamSanitization, SupportingUnitController.getSupportingUnitById);
router.post('/', isAdmin, createSanitization, SupportingUnitController.createSupportingUnit);
router.put('/:id', isAdmin, updateSanitization, SupportingUnitController.updateSupportingUnitById);
router.delete('/:id', isAdmin, idParamSanitization, SupportingUnitController.deleteSupportingUnitById);

module.exports = router;