const { body, param } = require('express-validator');
const validationHandler = require('../../../utils/validationHandler'); 

exports.createSanitization = [
    body('village_id')
        .escape()
        .trim()
        .isInt().withMessage('village_id must be an integer'),
    body('village_building_id')
        .escape()
        .trim()
        .isInt().withMessage('village_building_id must be an integer'),
    body('unit_name')
        .escape()
        .trim()
        .isString().withMessage('unit_name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('unit_name must not be empty'),
    body('quantity')
        .escape()
        .trim()
        .isInt().withMessage('quantity must be a number'),
    validationHandler.errorhandler
] 

exports.updateSanitization = [    
    param('id')
        .escape()
        .trim()
        .isInt().withMessage('Id must be an integer'),
    body('village_id')
        .escape()
        .trim()
        .isInt().withMessage('village_id must be an integer')
        .optional(),
    body('unit_name')
        .escape()
        .trim()
        .isString().withMessage('unit_name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('unit_name must not be empty')
        .optional(),
    body('quantity')
        .escape()
        .trim()
        .isInt().withMessage('quantity must be a number')
        .optional(),
    validationHandler.errorhandler
]

exports.idParamSanitization = [
    param('id')
        .escape()
        .trim()
        .isInt().withMessage('Id must be an integer'),
    validationHandler.errorhandler
]
