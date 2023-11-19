const express = require('express');
const router = express.Router();
const VillageTrainingProgressController = require('./village_training_progress.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { 
    createSanitization,
    updateSanitization, 
    idParamSanitization, 
    cancelerTrainingSanitization 
} = require('./village_training_progress.sanitization');

// auth routes
router.get('/', VillageTrainingProgressController.getAll);
router.get('/:id', idParamSanitization, VillageTrainingProgressController.getById);
router.post('/', createSanitization, VillageTrainingProgressController.create);
router.put('/:id/:village_id', cancelerTrainingSanitization, VillageTrainingProgressController.cancelTraining);

// admin routes
router.put('/:id', isAdmin, updateSanitization, VillageTrainingProgressController.update);
router.delete('/:id', isAdmin, idParamSanitization, VillageTrainingProgressController.delete);

module.exports = router;