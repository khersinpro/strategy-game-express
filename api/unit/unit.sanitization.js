const { body, param } = require('express-validator');
const validationHandler = require('../../utils/validationHandler'); 

exports.createSanitization = [
    body('name')
        .escape()
        .isString().withMessage('Name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Name must be between 1 and 255 characters long'),
    body('atk')
        .escape()
        .isInt().withMessage('Atk must be an integer'),
    body('carrying')
        .escape()
        .isInt().withMessage('Carrying must be an integer'),
    body('civilization_type')
        .escape()
        .isString().withMessage('Unit type must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Civilization type must be between 1 and 255 characters long'),
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
    body('atk')
        .escape()
        .isInt().withMessage('Atk must be an integer')
        .optional(),
    body('carrying')
        .escape()
        .isInt().withMessage('Carrying must be an integer')
        .optional(),
    body('civilization_type')
        .escape()
        .isString().withMessage('Unit type must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Civilization type must be between 1 and 255 characters long')
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

