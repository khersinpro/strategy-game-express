const { body, param, query } = require('express-validator');
const validationHandler = require('../../utils/validationHandler'); 

exports.createSanitization = [
    body('name')
        .escape()
        .isString().withMessage('Name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Name must be between 1 and 255 characters long'),
    body('attack')
        .escape()
        .isInt().withMessage('Attack must be an integer'),
    body('carrying_capacity')
        .escape()
        .isInt().withMessage('Carrying capacity must be an integer'),
    body('movement_speed')
        .escape()
        .isInt().withMessage('Movement speed must be an integer'),
    body('population_cost')
        .escape()
        .isInt().withMessage('Population cost must be an integer'),
    body('training_time')
        .escape()
        .isInt().withMessage('Training time must be an integer'),
    body('civilization_name')
        .escape()
        .isString().withMessage('Civilization name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Civilization name must be between 1 and 255 characters long'),
    body('unit_type')
        .escape()
        .isString().withMessage('Unit type must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Unit type must be between 1 and 255 characters long'),
    body('military_building')
        .escape()
        .isString().withMessage('Military building must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Military building must be between 1 and 255 characters long'),
    validationHandler.errorhandler
] 

exports.updateSanitization = [    
    param('name')
        .escape()
        .isString().withMessage('Name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Name must be between 1 and 255 characters long'),
    body('name')
        .escape()
        .isString().withMessage('Name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Name must be between 1 and 255 characters long')
        .optional(),
    body('attack')
        .escape()
        .isInt().withMessage('Attack must be an integer')
        .optional(),
    body('carrying_capacity')
        .escape()
        .isInt().withMessage('Carrying capacity must be an integer')
        .optional(),
    body('movement_speed')
        .escape()
        .isInt().withMessage('Movement speed must be an integer')
        .optional(),
    body('population_cost')
        .escape()
        .isInt().withMessage('Population cost must be an integer')
        .optional(),
    body('training_time')
        .escape()
        .isInt().withMessage('Training time must be an integer')
        .optional(),
    body('civilization_name')
        .escape()
        .isString().withMessage('Civilization name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Civilization name must be between 1 and 255 characters long')
        .optional(),
    body('unit_type')
        .escape()
        .isString().withMessage('Unit type must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Unit type must be between 1 and 255 characters long')
        .optional(),
    body('military_building')
        .escape()
        .isString().withMessage('Military building must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Military building must be between 1 and 255 characters long')
        .optional(),
    validationHandler.errorhandler
]

exports.nameParamSanitization = [
    param('name')
        .escape()
        .isString().withMessage('Name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Name must be between 1 and 255 characters long'),
    validationHandler.errorhandler
]

exports.getQuerySanitization = [
    query('page').escape().trim().isInt().withMessage('Invalid page type.'),
    query('limit').escape().trim().isInt().withMessage('Invalid limit type.'),
    validationHandler.errorhandler
]