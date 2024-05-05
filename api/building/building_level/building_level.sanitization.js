const { body, param } = require('express-validator');
const validationHandler = require('../../../utils/validationHandler'); 

exports.createSanitization = [  
    body('building_name')
        .escape()
        .trim()
        .isString().withMessage('building_name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('building_name must not be empty'),
    body('time')
        .escape()
        .trim()
        .isInt().withMessage('time must be a number'),
    validationHandler.errorhandler
] 

exports.updateSanitization = [    
    param('id')
        .escape()
        .trim()
        .isNumeric().withMessage('id must be a number'),
    body('building_name')
        .escape()
        .trim()
        .isString().withMessage('building_name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('building_name must not be empty')
        .optional(),
    body('level')
        .escape()
        .trim()
        .isInt().withMessage('level must be a number')
        .optional(),
    body('time')
        .escape()
        .trim()
        .isInt().withMessage('time must be a number')
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