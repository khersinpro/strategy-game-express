const express = require('express');
const router = express.Router();
const { createSanitization, updateSanitization, nameParamSanitization } = require('./server.sanitization');
const { isAdmin } = require('../../middlewares/auth');
const serverController = require('./server.controller');

/**
 * Aurhenticaded routes
 */
router.get('/', serverController.getAll);
router.get('/:name', nameParamSanitization, serverController.get);

/**
 * Admin routes
 */ 
router.post('/',isAdmin, createSanitization, serverController.create);
router.put('/:name', isAdmin, nameParamSanitization, createSanitization, serverController.update);
router.delete('/:name', isAdmin, nameParamSanitization, serverController.delete);

module.exports = router;