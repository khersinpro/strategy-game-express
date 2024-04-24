const express = require('express');
const router = express.Router();
const resourceController = require('./resource.controller');
const { nameParamSanitization, createSanitization, updateSanitization } = require('./resource.sanitization');
const { isAdmin } = require('../../middlewares/auth');

router.get('/', resourceController.getAll);
router.get('/:name', nameParamSanitization, resourceController.get);

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, resourceController.create);
router.put('/:name', isAdmin, nameParamSanitization, updateSanitization, resourceController.update);
router.delete('/:name', isAdmin, nameParamSanitization, resourceController.delete);

module.exports = router;