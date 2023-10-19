const { body, param } = require('express-validator');
const validationHandler = require('../../../utils/validationHandler'); 

exports.createSanitization = [
    body('production')
        .escape()
        .trim()
        .isNumeric(),
    body('resource_building_name')
        .escape()
        .trim()
        .isString().withMessage('resource_building_name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('resource_building_name must not be empty'),
    body('building_level_id')
        .escape()
        .trim()
        .isNumeric().withMessage('building_level_id must be a number'),
    validationHandler.errorhandler
] 

exports.updateSanitization = [    
    param('id')
        .escape()
        .trim()
        .isNumeric().withMessage('id must be a number'),
    body('production')
        .escape()
        .trim()
        .isNumeric()
        .optional(),
    body('resource_building_name')
        .escape()
        .trim()
        .isString().withMessage('resource_building_name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('resource_building_name must not be empty')
        .optional(),
    body('building_level_id')
        .escape()
        .trim()
        .isNumeric().withMessage('building_level_id must be a number')
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