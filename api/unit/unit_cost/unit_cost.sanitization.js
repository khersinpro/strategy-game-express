const { body, param } = require('express-validator');
const validationHandler = require('../../../utils/validationHandler'); 

exports.createSanitization = [  
    body('quantity')
        .escape()
        .trim()
        .isInt().withMessage('Quantity must be a number'),
    body('resource_name')
        .escape()
        .trim()
        .isString().withMessage('Resource name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Resource name must not be empty'),
    body('unit_name')
        .escape()
        .trim()
        .isString().withMessage('Unit name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Unit name should be between 3 and 50 characters long'),
    validationHandler.errorhandler
] 

exports.updateSanitization = [    
    body('quantity')
        .escape()
        .trim()
        .isInt().withMessage('Quantity must be a number')
        .optional(),
    body('resource_name')
        .escape()
        .trim()
        .isString().withMessage('Resource name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Resource name must not be empty')
        .optional(),
    body('unit_name')
        .escape()
        .trim()
        .isString().withMessage('Unit name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Unit name should be between 3 and 50 characters long')
        .optional(),
    validationHandler.errorhandler
]

exports.idParamSanitization = [
    param('id')
        .escape()
        .trim()
        .isNumeric().withMessage('id must be a number'),
    validationHandler.errorhandler
]