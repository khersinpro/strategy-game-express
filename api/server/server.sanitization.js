const { body, param } = require('express-validator');
const validationHandler = require('../../utils/validationHandler'); 

exports.createSanitization = [
    body('name').trim().escape().isString().isLength({min: 3, max: 30}).withMessage('Server name must be between 3 and 30 characters.'),
    validationHandler.errorhandler,
] 

exports.updateSanitization = [    
    param('name').trim().escape().isString().isLength({min: 3, max: 30}).withMessage('Server name must be between 3 and 30 characters.'),
    body('name').trim().escape().isString().isLength({min: 3, max: 30}).withMessage('Server name must be between 3 and 30 characters.').optional(),
    validationHandler.errorhandler
]

exports.nameParamSanitization = [
    param('name').trim().escape().isString().isLength({min: 3, max: 30}).withMessage('Server name must be between 3 and 30 characters.'),  
    validationHandler.errorhandler
]
