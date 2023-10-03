const { body, param } = require('express-validator');
const validationHandler = require('../../utils/validationHandler'); 

exports.createSanitization = [
    body('name')
        .escape()
        .trim()
        .isString().withMessage('name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('name must not be empty'),
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