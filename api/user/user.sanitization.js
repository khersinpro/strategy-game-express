const { body, param } = require('express-validator');
const validationHandler = require('../../utils/validationHandler'); 
/**
 * Sanitization of user creation
 */
exports.createSanitization = [
    body('username').trim().escape().isAlpha().isLength({min: 3, max: 30}).withMessage('Le nom d\'utilisateur doit faire entre 3 et 30 caractères.'),
    body('email').isEmail().withMessage('L\'email est incorrect.'),
    body('password').trim().escape().isLength({min: 5, max: 20}).withMessage('Le mot de passe doit contenir entre 5 et 20 caractères'),
    validationHandler.errorhandler,
] 

/**
 * Sanitization of user login
 */
exports.loginSanitization = [
    body('email').trim().escape().isLength({min: 3, max: 30}).withMessage('Le nom d\'utilisateur doit faire entre 3 et 30 caractères.'),
    body('password').trim().escape().isLength({min: 5, max: 20}).withMessage('Le mot de passe doit contenir entre 5 et 20 caractères'),
    validationHandler.errorhandler
]

/**
 * Sanitization of user update
 */
exports.updateSanitization = [    
    param('id').trim().escape().isInt().withMessage('Invalid id type.'),
    body('username').trim().escape().isAlpha().isLength({min: 3, max: 30}).withMessage('Le nom d\'utilisateur doit faire entre 3 et 30 caractères.').optional(),
    body('email').isEmail().withMessage('L\'email est incorrect.').optional(),
    body('password').trim().escape().isLength({min: 5, max: 20}).withMessage('Le mot de passe doit contenir entre 5 et 20 caractères').optional(),
    validationHandler.errorhandler
]

exports.idParamSanitization = [
    param('id').trim().escape().isInt().withMessage('Invalid id type.'),
    validationHandler.errorhandler
]

exports.serveurNameSanitization = [
    body('server').trim().escape().isString().isLength({min: 3, max: 30}).withMessage('Le nom du serveur doit faire entre 3 et 30 caractères.'),
    validationHandler.errorhandler
]
