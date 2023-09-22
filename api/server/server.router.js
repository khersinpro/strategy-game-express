const express = require('express');
const router = express.Router();
const serverController = require('./server.controller');

router.get('/', serverController.getAll);
router.get('/:name', serverController.get);
router.post('/', serverController.create);
router.put('/:name', serverController.update);
router.delete('/:name', serverController.delete);

module.exports = router;