const express = require('express');
const router = express.Router();
const SupportController = require('./support.controller');
const {
    idParamSanitization,
    createSanitization
} = require('./support.sanitization');

router.get('/', SupportController.getAll);
router.get('/:id', idParamSanitization, SupportController.get);
router.post('/', createSanitization, SupportController.create);
router.put('/:id', idParamSanitization, SupportController.cancelSupport);

module.exports = router;