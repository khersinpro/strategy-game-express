const express = require('express');
const router = express.Router();
const VillageTrainingProgressController = require('./village_training_progress.controller');
const { createSanitization, updateSanitization, idParamSanitization } = require('./village_training_progress.sanitization');
const { isAdmin } = require('../../../middlewares/auth');

// auth routes
router.get('/', VillageTrainingProgressController.getAll);
router.get('/:id', idParamSanitization, VillageTrainingProgressController.getById);
router.post('/', createSanitization, VillageTrainingProgressController.create);

// admin routes
router.put('/:id', updateSanitization, VillageTrainingProgressController.update);
router.delete('/:id', idParamSanitization, VillageTrainingProgressController.delete);

module.exports = router;