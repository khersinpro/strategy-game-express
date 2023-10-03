const express = require('express');
const router = express.Router();
const RessourceBuildingController = require('./ressource_building.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { nameParamSanitization, createSanitization, updateSanitization } = require('./ressource_building.sanitization')

/**
 * Auth routes
 */
router.get('/', RessourceBuildingController.getAll);
router.get('/:name', nameParamSanitization, RessourceBuildingController.get);

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, RessourceBuildingController.create);
router.put('/:name', isAdmin, updateSanitization, RessourceBuildingController.update);
router.delete('/:name', isAdmin, nameParamSanitization, RessourceBuildingController.delete);

module.exports = router;