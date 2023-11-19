const { body, param } = require('express-validator');
const validationHandler = require('../../../utils/validationHandler'); 

exports.createSanitization = [
    body('village_id')
        .trim()
        .escape()
        .isInt().withMessage('village_id must be an integer'),
    body('unit_name')
        .trim()
        .escape()
        .isString().withMessage('unit_name must be a string')
        .isLength({ min: 1, max: 55 }).withMessage('unit_name must be between 1 and 55 characters long'),
    body('unit_to_train_count')
        .trim()
        .escape()
        .isInt().withMessage('unit_to_train_count must be an integer'),
    validationHandler.errorhandler
] 

exports.updateSanitization = [    
    param('id')
        .trim()
        .escape()
        .isInt().withMessage('id must be an integer'),
    body('unit_to_train_count')
        .trim()
        .escape()
        .isInt().withMessage('unit_to_train_count must be an integer')
        .optional(),
    body('trained_unit_count')
        .trim()
        .escape()
        .isInt().withMessage('trained_unit_count must be an integer')
        .optional(),
    body('training_start')
        .trim()
        .escape()
        .isDate().withMessage('training_start must be a date')
        .optional(),
    body('training_end')
        .trim()
        .escape()
        .isDate().withMessage('training_end must be a date')
        .optional(),
    body('enabled')
        .trim()
        .escape()
        .isBoolean().withMessage('enabled must be a boolean')
        .optional(),
    body('archived')
        .trim()
        .escape()
        .isBoolean().withMessage('archived must be a boolean')
        .optional(),    
    validationHandler.errorhandler
]

exports.cancelerTrainingSanitization = [
    param('id')
        .trim()
        .escape()
        .isInt().withMessage('id must be an integer'),
    param('village_id')
        .trim()
        .escape()
        .isInt().withMessage('village_id must be an integer'),
    validationHandler.errorhandler
]

exports.idParamSanitization = [
    param('id')
        .trim()
        .escape()
        .isInt().withMessage('id must be an integer'),
    validationHandler.errorhandler
]
