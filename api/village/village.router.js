const express = require('express');
const router = express.Router();
const villageController = require('./village.controller');

router.get('/', villageController.getAll);
router.get('/:id', villageController.get);
router.post('/', villageController.create);
router.put('/:id', villageController.update);
router.delete('/:id', villageController.delete);


module.exports = router;