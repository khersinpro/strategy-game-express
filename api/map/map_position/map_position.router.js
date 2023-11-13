const express = require('express');
const router = express.Router();
const MapPositionController = require('./map_position.controller');
const {idParamSanitization, createSanitization, updateSanitization} = require('./map_position.sanitization');
const { isAdmin } = require('../../../middlewares/auth');

/**
 * Admin routes
 */
router.get('/', isAdmin, MapPositionController.getAll);
router.get('/:id', isAdmin, idParamSanitization, MapPositionController.getById);
router.post('/', isAdmin, createSanitization, MapPositionController.create);
router.put('/:id', isAdmin, updateSanitization, MapPositionController.update);
router.delete('/:id', isAdmin, idParamSanitization, MapPositionController.delete);

module.exports = router;