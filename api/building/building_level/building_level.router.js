const express = require('express');
const router = express.Router();
const WallDefenseController = require('./building_level.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { idParamSanitization, createSanitization, updateSanitization } = require('./building_level.sanitization')

/**
 * Auth routes
 */
router.get('/', WallDefenseController.getAll);
router.get('/:id', idParamSanitization, WallDefenseController.get);

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, WallDefenseController.create);
router.put('/:id', isAdmin, updateSanitization, WallDefenseController.update);
router.delete('/:id', isAdmin, idParamSanitization, WallDefenseController.delete);

module.exports = router;