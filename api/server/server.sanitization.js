const { body, param } = require('express-validator');
const validationHandler = require('../../utils/validationHandler'); 

exports.createSanitization = [
    body('name').trim().escape().isString().isLength({min: 3, max: 30}).withMessage('Le nom de serveur doit faire entre 3 et 30 caractères.'),
    validationHandler.errorhandler,
] 

exports.updateSanitization = [    
    param('name').trim().escape().isString().isLength({min: 3, max: 30}).withMessage('Le nom de serveur doit faire entre 3 et 30 caractères.'),
    body('name').trim().escape().isString().isLength({min: 3, max: 30}).withMessage('Le nom de serveur doit faire entre 3 et 30 caractères.').optional(),
    validationHandler.errorhandler
]

exports.nameParamSanitization = [
    param('name').trim().escape().isString().isLength({min: 3, max: 30}).withMessage('Le nom de serveur doit faire entre 3 et 30 caractères.'),  
    validationHandler.errorhandler
]
