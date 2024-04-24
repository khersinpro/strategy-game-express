const { body, param, query } = require('express-validator');
const validationHandler = require('../../utils/validationHandler'); 

exports.createSanitization = [
    body('name')
        .escape()
        .trim()
        .isString().withMessage('name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('name must not be empty'),
    body('type')
        .escape()
        .trim()
        .isString().withMessage('type must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('type must not be empty'),
    body('is_common')
        .escape()
        .trim()
        .isBoolean().withMessage('is_common must be a boolean'),
    validationHandler.errorhandler
] 

exports.updateSanitization = [    
    param('name')
        .escape()
        .trim()
        .isString().withMessage('name must be a string')
        .isLength({ min: 3 }).withMessage('name must not be empty'),
    body('name')
        .escape()
        .trim()
        .isString().withMessage('name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('name must not be empty')
        .optional(),
    body('type')
        .escape()
        .trim()
        .isString().withMessage('type must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('type must not be empty')
        .optional(),
    body('is_common')
        .escape()
        .trim()
        .isBoolean().withMessage('is_common must be a boolean')
        .optional(),
    validationHandler.errorhandler
]

exports.nameParamSanitization = [
    param('name')
        .escape()
        .trim()
        .isString().withMessage('name must be a string')
        .isLength({ min: 3 }).withMessage('name must not be empty'),
    validationHandler.errorhandler
]

exports.getQuerySanitization = [
    query('page').escape().trim().isInt().withMessage('Invalid page type.'),
    query('limit').escape().trim().isInt().withMessage('Invalid limit type.'),
    validationHandler.errorhandler
]