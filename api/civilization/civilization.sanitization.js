const { body, param } = require('express-validator');
const validationHandler = require('../../utils/validationHandler'); 

exports.createSanitization = [
    body('name')
        .escape()
        .trim()
        .isString().withMessage('name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('name must be between 3 and 50 characters'),
    validationHandler.errorhandler
] 

exports.updateSanitization = [    
    param('name')
        .escape()
        .trim()
        .isString().withMessage('name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('name must be between 3 and 50 characters'),
    body('name')
        .escape()
        .trim()
        .isString().withMessage('name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('name must be between 3 and 50 characters')
        .optional(),
    validationHandler.errorhandler
]

exports.nameParamSanitization = [
    param('name')
        .escape()
        .trim()
        .isString().withMessage('name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('name must be between 3 and 50 characters'),
    validationHandler.errorhandler
]
