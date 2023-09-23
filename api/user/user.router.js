const express = require('express');
const usersController = require('./user.controller');
const router = express.Router();
const { createSanitization, updateSanitization, idParamSanitization, serveurNameSanitization } = require('./user.sanitization');
const { isAdmin } = require('../../middlewares/auth');

/**
 * Aurhenticaded routes
 */
router.get('/', usersController.getAll);
router.get('/me', usersController.me);
router.get('/:id', idParamSanitization, usersController.get);
router.post('/', createSanitization, usersController.create);
router.put('/:id', updateSanitization, usersController.update);
router.post('/server/:id', idParamSanitization, serveurNameSanitization, usersController.addServer);
router.put('/server/:id', idParamSanitization, serveurNameSanitization, usersController.removeServer);

/**
 * Admin routes
 */
router.delete('/:id', isAdmin, idParamSanitization, usersController.delete);

module.exports = router;