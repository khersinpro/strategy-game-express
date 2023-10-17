const { body, param } = require('express-validator');
const validationHandler = require('../../../utils/validationHandler'); 

exports.createSanitization = [  
    body('wall_building_name')
        .escape()
        .trim()
        .isString().withMessage('name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('name must not be empty'),
    body('building_level_id')
        .escape()
        .trim()
        .isInt().withMessage('building_level_id must be a number'),
    body('defense_percent')
        .escape()
        .trim()
        .isInt().withMessage('defense_percent must be a number'),
    validationHandler.errorhandler
] 

exports.updateSanitization = [    
    param('id')
        .escape()
        .trim()
        .isNumeric().withMessage('id must be a number'),
    body('wall_building_name')
        .escape()
        .trim()
        .isString().withMessage('name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('name must not be empty')
        .optional(),
    body('building_level_id')
        .escape()
        .trim()
        .isInt().withMessage('building_level_id must be a number')
        .optional(),
    body('defense_percent')
        .escape()
        .trim()
        .isInt().withMessage('defense_percent must be a number')
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