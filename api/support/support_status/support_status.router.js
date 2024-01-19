const SupportStatusController = require('./support_status.controller');
const express = require('express');
const router = express.Router();
const {
    idParamSanitization,
    createSanitization
} = require('./support_status.sanitization');
const { isAdmin } = require('../../../middlewares/auth');

/**
 * Only admin routes
 */
router.get('/', isAdmin, SupportStatusController.getAll);
router.get('/:id', isAdmin, idParamSanitization, SupportStatusController.get);
router.post('/', isAdmin, createSanitization, SupportStatusController.create);
router.put('/:id', isAdmin, idParamSanitization, createSanitization, SupportStatusController.update);
router.delete('/:id', isAdmin, idParamSanitization, SupportStatusController.delete);

module.exports = router;