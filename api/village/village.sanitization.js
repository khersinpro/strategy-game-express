const { body, param } = require('express-validator');
const validationHandler = require('../../utils/validationHandler'); 

exports.createSanitization = [
    body('name').trim().escape().isString().isLength({min: 3, max: 30}).withMessage('Le nom de village doit faire entre 3 et 30 caractères.'),
    body('server_name').trim().escape().isString().isLength({min: 3, max: 30}).withMessage('Le nom de serveur doit faire entre 3 et 30 caractères.'),
    validationHandler.errorhandler,
] 

exports.updateSanitization = [    
    param('id').trim().escape().isInt().withMessage('Invalid id type.'),
    body('name').trim().escape().isString().isLength({min: 3, max: 30}).withMessage('Le nom de village doit faire entre 3 et 30 caractères.').optional(),
    validationHandler.errorhandler
]

exports.idParamSanitization = [
    param('id').trim().escape().isInt().withMessage('Invalid id type.'),
    validationHandler.errorhandler
]
