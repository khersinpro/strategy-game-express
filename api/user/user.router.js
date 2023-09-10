const express = require('express');
const usersController = require('./user.controller');
const router = express.Router();
const { createSanitization, updateSanitization } = require('./user.sanitization');

router.get('/', usersController.getAll);
router.get('/me', usersController.me);
router.get('/:id', usersController.get);
router.post('/', createSanitization, usersController.create);
router.put('/:id', updateSanitization, usersController.update);
router.delete('/:id', usersController.delete);

module.exports = router;