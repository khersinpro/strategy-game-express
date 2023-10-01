const { body, param } = require('express-validator');
const validationHandler = require('../../utils/validationHandler'); 

exports.createSanitization = [
    body('type')
        .escape()
        .isAlpha().withMessage('Type must be alphabetic')
        .isLength({ min: 3, max: 50 }).withMessage('Type must be between 1 and 255 characters long'),
    validationHandler.errorhandler
] 

exports.updateSanitization = [    
    param('type')
        .escape()
        .isAlpha().withMessage('Type must be alphabetic')
        .isLength({ min: 3, max: 50 }).withMessage('Type must be between 1 and 255 characters long'),
    body('type')
        .escape()
        .isAlpha().withMessage('Type must be alphabetic')
        .isLength({ min: 3, max: 50 }).withMessage('Type must be between 1 and 255 characters long')
        .optional(),
    validationHandler.errorhandler
]

exports.typeParamSanitization = [
    param('type')
        .escape()
        .isAlpha().withMessage('Type must be alphabetic')
        .isLength({ min: 3, max: 50 }).withMessage('Type must be between 1 and 255 characters long'),
    validationHandler.errorhandler
]
