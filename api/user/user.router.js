const express = require('express');
const usersController = require('./user.controller');
const router = express.Router();

router.get('/', usersController.getAll);
router.get('/me', usersController.me);
router.get('/:id', usersController.get);
router.post('/', usersController.create);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);

module.exports = router;