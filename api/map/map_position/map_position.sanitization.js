const { body, param } = require('express-validator');
const validationHandler = require('../../../utils/validationHandler'); 

exports.createSanitization = [
    body('target_type')
        .trim()
        .escape()
        .isString().withMessage('target_type must be a string')
        .isLength({ min: 1, max: 55 }).withMessage('target_type must be between 1 and 55 characters long'), 
    body('target_entity_id')
        .trim()
        .escape()
        .isInt().withMessage('target_entity_id must be an integer'),
    body('map_id')
        .trim()
        .escape()
        .isInt().withMessage('map_id must be an integer'),
    body('x')
        .trim()
        .escape()
        .isInt().withMessage('x must be an integer')
        .isLength({ min: 1, max: 15 }).withMessage('x must be between 1 and 15 characters long'),
    body('y')
        .trim()
        .escape()
        .isInt().withMessage('y must be an integer')
        .isLength({ min: 1, max: 15 }).withMessage('y must be between 1 and 15 characters long'),
    validationHandler.errorhandler
] 

exports.updateSanitization = [    
    param('id')
        .trim()
        .escape()
        .isInt().withMessage('id must be an integer'),
    body('target_type')
        .trim()
        .escape()
        .isString().withMessage('target_type must be a string')
        .isLength({ min: 1, max: 55 }).withMessage('target_type must be between 1 and 55 characters long')
        .optional(), 
    body('target_entity_id')
        .trim()
        .escape()
        .isInt().withMessage('target_entity_id must be an integer')
        .optional(),
    body('map_id')
        .trim()
        .escape()
        .isInt().withMessage('map_id must be an integer')
        .optional(),
    body('x')
        .trim()
        .escape()
        .isInt().withMessage('x must be an integer')
        .isLength({ min: 1, max: 15 }).withMessage('x must be between 1 and 15 characters long')
        .optional(),
    body('y')
        .trim()
        .escape()
        .isInt().withMessage('y must be an integer')
        .isLength({ min: 1, max: 15 }).withMessage('y must be between 1 and 15 characters long')
        .optional(),
    validationHandler.errorhandler
]

exports.idParamSanitization = [
    param('id')
        .trim()
        .escape()
        .isInt().withMessage('id must be an integer'),
    validationHandler.errorhandler
]
