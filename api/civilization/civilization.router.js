const express = require('express');
const router = express.Router();
const civilizationController = require('./civilization.controller');
const { isAdmin } = require('../../middlewares/auth');
const { nameParamSanitization, createSanitization, updateSanitization } = require('./civilization.sanitization');

// Route for Admins
router.get('/', isAdmin, civilizationController.getAll);
router.get('/:name', isAdmin, nameParamSanitization, civilizationController.get);
router.post('/', isAdmin, createSanitization, civilizationController.create);
router.put('/:name', isAdmin, updateSanitization, civilizationController.update);
router.delete('/:name', isAdmin, nameParamSanitization, civilizationController.delete);

module.exports = router;