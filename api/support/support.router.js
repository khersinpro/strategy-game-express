const express = require('express');
const router = express.Router();
const SupportController = require('./support.controller');

router.get('/', SupportController.getAll);
router.get('/:id', SupportController.get);
router.post('/', SupportController.create);
router.put('/:id', SupportController.cancelSupport);

module.exports = router;