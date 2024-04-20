const { body, param, query } = require('express-validator');
const validationHandler = require('../../utils/validationHandler'); 
/**
 * Sanitization of user creation
 */
exports.createSanitization = [
    body('username').trim().escape().isAlpha().isLength({min: 3, max: 30}).withMessage('Username must be between 3 and 30 characters.'),
    body('email').isEmail().withMessage('Email is incorrect.'),
    body('password').trim().escape().isLength({min: 5, max: 20}).withMessage('Password must be between 5 and 20 characters.'),
    validationHandler.errorhandler,
] 

/**
 * Sanitization of user login
 */
exports.loginSanitization = [
    body('email').trim().escape().isLength({min: 3, max: 30}).withMessage('Username must be between 3 and 30 characters.'),
    body('password').trim().escape().isLength({min: 5, max: 20}).withMessage('Password must be between 5 and 20 characters.'),
    validationHandler.errorhandler
]

/**
 * Sanitization of user update
 */
exports.updateSanitization = [    
    param('id').trim().escape().isInt().withMessage('Invalid id type.'),
    body('username').trim().escape().isAlpha().isLength({min: 3, max: 30}).withMessage('Username must be between 3 and 30 characters.').optional(),
    body('email').isEmail().withMessage('Email is incorrect.').optional(),
    body('password').trim().escape().isLength({min: 5, max: 20}).withMessage('Password must be between 5 and 20 characters.').optional(),
    validationHandler.errorhandler
]

exports.idParamSanitization = [
    param('id').trim().escape().isInt().withMessage('Invalid id type.'),
    validationHandler.errorhandler
]

exports.serveurNameSanitization = [
    body('server').trim().escape().isString().isLength({min: 3, max: 30}).withMessage('Server name must be between 3 and 30 characters.'),
    validationHandler.errorhandler
]

exports.getQuerySanitization = [
    query('page').trim().isInt().withMessage('Invalid page type.').optional(),
    query('limit').trim().isInt().withMessage('Invalid limit type.').optional(),
    query('id').trim().isInt().withMessage('Invalid id type.').optional(),
    query('username').escape().isString().withMessage('Username must be a string.').optional(),  
    query('email').escape().isString().withMessage('Email is incorrect.').optional(),
    query('role').escape().isString().withMessage('Role is incorrect.').optional(),
    validationHandler.errorhandler
]
