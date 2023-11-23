const { body, param } = require('express-validator');
const validationHandler = require('../../../utils/validationHandler'); 

exports.createSanitization = [
    body('name')
        .escape()
        .trim()
        .isString().withMessage('Name must be a string')
        .isLength({ min: 1, max: 45 }).withMessage('Name must be between 1 and 45 characters')
        .exists().withMessage('Name is required'),
    validationHandler.errorhandler
] 

exports.updateSanitization = [    
    param('name')
        .escape()
        .trim()
        .isString().withMessage('Name must be a string')
        .isLength({ min: 1, max: 45 }).withMessage('Name must be between 1 and 45 characters'),
    body('name')
        .escape()
        .trim()
        .isString().withMessage('Name must be a string')
        .isLength({ min: 1, max: 45 }).withMessage('Name must be between 1 and 45 characters')
        .optional(),
    validationHandler.errorhandler
]

exports.nameParamSanitization = [
    param('name')
        .escape()
        .trim()
        .isString().withMessage('Name must be a string')
        .isLength({ min: 1, max: 45 }).withMessage('Name must be between 1 and 45 characters')
        .exists().withMessage('Name is required')
        .notEmpty().withMessage('Name must not be empty'),
    validationHandler.errorhandler
]
