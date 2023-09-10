const { check, validationResult } = require('express-validator');
const BadRequestError = require('../../errors/bad-request');


const errorhandler = (req, res, next) => {
    const errors = !validationResult(req).isEmpty() ? validationResult(req).mapped() : null;

    if (errors !== null) 
    { 
        return res.status(400).json({ errors });
    };
    
    next();
}

/**
 * Sanitization of user creation
 */
exports.createSanitization = [
    check('username').trim().escape().isLength({min: 3, max: 30}).withMessage('Le nom d\'utilisateur doit faire entre 3 et 30 caractères.'),
    check('email').isEmail().withMessage('L\'email est incorrect.'),
    check('password').trim().escape().isLength({min: 5, max: 20}).withMessage('Le mot de passe doit contenir entre 5 et 20 caractères'),
    errorhandler,
] 

/**
 * Sanitization of user login
 */
exports.loginSanitization = [
    check('email').trim().escape().isLength({min: 3, max: 30}).withMessage('Le nom d\'utilisateur doit faire entre 3 et 30 caractères.'),
    check('password').trim().escape().isLength({min: 5, max: 20}).withMessage('Le mot de passe doit contenir entre 5 et 20 caractères'),
    errorhandler
]

/**
 * Sanitization of user update
 */
exports.updateSanitization = [
    check('username').trim().escape().isLength({min: 3, max: 30}).withMessage('Le nom d\'utilisateur doit faire entre 3 et 30 caractères.').optional(),
    check('email').isEmail().withMessage('L\'email est incorrect.').optional(),
    check('password').trim().escape().isLength({min: 5, max: 20}).withMessage('Le mot de passe doit contenir entre 5 et 20 caractères').optional(),
    errorhandler
]
