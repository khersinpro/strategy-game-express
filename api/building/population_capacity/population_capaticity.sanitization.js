const { body, param } = require('express-validator');
const validationHandler = require('../../../utils/validationHandler'); 

exports.createSanitization = [
    body('capacity')
        .escape()
        .trim()
        .isNumeric('capacity must be a number'),
    body('town_all_building_name')
        .escape()
        .trim()
        .isString().withMessage('town_all_building_name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('town_all_building_name should be a string with a length between 3 and 50 characters'),
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
    body('capacity')
        .escape()
        .trim()
        .isNumeric('capacity must be a number')
        .optional(),
    body('town_all_building_name')
        .escape()
        .trim()
        .isString().withMessage('town_all_building_name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('town_all_building_name should be a string with a length between 3 and 50 characters')
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