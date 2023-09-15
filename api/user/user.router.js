const express = require('express');
const usersController = require('./user.controller');
const router = express.Router();
const { createSanitization, updateSanitization, idParamSanitization } = require('./user.sanitization');

router.get('/', usersController.getAll);
router.get('/me', usersController.me);
router.get('/:id', idParamSanitization, usersController.get);
router.post('/', createSanitization, usersController.create);
router.put('/:id', updateSanitization, usersController.update);
router.delete('/:id', idParamSanitization, usersController.delete);

module.exports = router;