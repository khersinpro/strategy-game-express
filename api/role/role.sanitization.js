const { body, param } = require('express-validator');
const validationHandler = require('../../utils/validationHandler'); 

/**
 * Sanitization of role creation
 */
exports.createSanitization = [
    body('name').trim().escape().isString().isLength({min: 3, max: 30}).withMessage('Name must be between 3 and 30 characters.'),
    validationHandler.errorhandler,
] 

/**
 * Sanitization of role update
 */
exports.updateSanitization = [
    param('name').trim().escape().isString().notEmpty().isLength({min: 3, max: 30}).withMessage('Name must be between 3 and 30 characters.'),
    body('name').trim().escape().isString().isLength({min: 3, max: 30}).withMessage('Name must be between 3 and 30 characters.').optional(),
    validationHandler.errorhandler
]

/**
 * Sanitization of role deletion
 */
exports.nameParamSanitization = [
    param('name').trim().escape().isString().notEmpty().isLength({min: 3, max: 30}).withMessage('Name must be between 3 and 30 characters.'),
    validationHandler.errorhandler
]
