const { body, param } = require('express-validator');
const validationHandler = require('../../utils/validationHandler'); 

exports.createSanitization = [
    body('unit_name')
        .escape()
        .trim()
        .isString().withMessage('unit_name must be a string')
        .isLength({ min: 1 }).withMessage('unit_name must not be empty'),
    body('type')
        .escape()
        .trim()
        .isString().withMessage('type must be a string')
        .isLength({ min: 1 }).withMessage('type must not be empty'),
    body('defense_value')
        .escape()
        .trim()
        .isNumeric().withMessage('defense_value must be a number')
        .isLength({ min: 1 }).withMessage('defense_value must not be empty'),
    validationHandler.errorhandler
] 

exports.updateSanitization = [    
    param('unitname')
        .escape()
        .trim()
        .isString().withMessage('unitname must be a string')
        .isLength({ min: 1 }).withMessage('unitname must not be empty'),
    param('type')
        .escape()
        .trim()
        .isString().withMessage('type must be a string')
        .isLength({ min: 1 }).withMessage('type must not be empty'),
    body('unit_name')
        .escape()
        .trim()
        .isString().withMessage('unit_name must be a string')
        .isLength({ min: 1 }).withMessage('unit_name must not be empty')
        .optional(),
    body('type')
        .escape()
        .trim()
        .isString().withMessage('type must be a string')
        .isLength({ min: 1 }).withMessage('type must not be empty')
        .optional(),
    body('defense_value')
        .escape()
        .trim()
        .isNumeric().withMessage('defense_value must be a number')
        .isLength({ min: 1 }).withMessage('defense_value must not be empty')
        .optional(),
    validationHandler.errorhandler
]

exports.nameParamSanitization = [
    param('unitname')
        .escape()
        .trim()
        .isString().withMessage('unitname must be a string')
        .isLength({ min: 1 }).withMessage('unitname must not be empty'),
    validationHandler.errorhandler
]

exports.typeParamSanitization = [
    param('type')
        .escape()
        .trim()
        .isString().withMessage('type must be a string')
        .isLength({ min: 1 }).withMessage('type must not be empty'),
    validationHandler.errorhandler
]
