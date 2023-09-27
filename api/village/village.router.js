const express = require('express');
const router = express.Router()
const { createSanitization, updateSanitization, idParamSanitization } = require('./village.sanitization');
const { isAdmin } = require('../../middlewares/auth');
const villageController = require('./village.controller');

router.get('/', villageController.getAll);
router.get('/:id', idParamSanitization, villageController.get);
router.post('/', createSanitization, villageController.create);
router.put('/:id', updateSanitization, villageController.update);
router.delete('/:id', isAdmin, idParamSanitization, villageController.delete);


module.exports = router;