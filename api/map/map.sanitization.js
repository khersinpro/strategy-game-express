const { body, param } = require('express-validator');
const validationHandler = require('../../utils/validationHandler'); 

exports.createSanitization = [
    body('server_name')
        .trim()
        .escape()
        .isString().withMessage('server_name must be a string')
        .isLength({ min: 1, max: 55 }).withMessage('server_name must be between 1 and 55 characters long'),  
    body('x_area')
        .trim()
        .escape()
        .isInt().withMessage('x_area must be an integer')
        .isLength({ min: 1, max: 15 }).withMessage('x_area must be between 1 and 55 characters long'),
    body('y_area')
        .trim()
        .escape()
        .isInt().withMessage('y_area must be an integer')
        .isLength({ min: 1, max: 15 }).withMessage('y_area must be between 1 and 55 characters long'),
    validationHandler.errorhandler
] 

exports.updateSanitization = [    
    param('id')
        .trim()
        .escape()
        .isInt().withMessage('id must be an integer'),
    body('server_name')
        .trim()
        .escape()
        .isString().withMessage('server_name must be a string')
        .isLength({ min: 1, max: 55 }).withMessage('server_name must be between 1 and 55 characters long')
        .optional(),  
    body('x_area')
        .trim()
        .escape()
        .isInt().withMessage('x_area must be an integer')
        .isLength({ min: 1, max: 15 }).withMessage('x_area must be between 1 and 55 characters long')
        .optional(),
    body('y_area')
        .trim()
        .escape()
        .isInt().withMessage('y_area must be an integer')
        .isLength({ min: 1, max: 15 }).withMessage('y_area must be between 1 and 55 characters long')
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
