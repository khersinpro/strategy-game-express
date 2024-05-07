const { body, param } = require('express-validator');
const validationHandler = require('../../../utils/validationHandler'); 

exports.createSanitization = [
    body('reduction_percent')
        .escape()
        .trim()
        .isNumeric('reduction_percent must be a number'),
    body('military_building_name')
        .escape()
        .trim()
        .isString().withMessage('military_building_name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('military_building_name should be a string with a length between 3 and 50 characters'),
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
    body('reduction_percent')
        .escape()
        .trim()
        .isNumeric('reduction_percent must be a number')
        .optional(),
    body('military_building_name')
        .escape()
        .trim()
        .isString().withMessage('military_building_name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('military_building_name should be a string with a length between 3 and 50 characters')
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