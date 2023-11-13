const express = require('express');
const router = express.Router();
const mapController = require('./map.controller');
const { idParamSanitization, createSanitization, updateSanitization } = require('./map.sanitization');
const { isAdmin } = require('../../middlewares/auth');

/**
 * Admin routes
 */
router.get('/', isAdmin, mapController.getAll);
router.get('/:id', isAdmin, idParamSanitization, mapController.getById);
router.post('/', isAdmin, createSanitization, mapController.create);
router.put('/:id', isAdmin, updateSanitization, mapController.update);
router.delete('/:id', isAdmin, idParamSanitization, mapController.delete);

module.exports = router;