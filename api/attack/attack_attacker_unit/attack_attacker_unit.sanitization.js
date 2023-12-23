const { body, param } = require('express-validator');
const validationHandler = require('../../../utils/validationHandler'); 

exports.createSanitization = [
    body('attack_id')
        .escape()
        .trim()
        .isInt().withMessage('attack_id must be an integer'),
    body('village_unit_id')
        .escape()
        .trim()
        .isInt().withMessage('village_unit_id must be an integer'),
    body('sent_quantity')
        .escape()
        .trim()
        .isInt().withMessage('sent_quantity must be an integer'),
    body('lost_quantity')
        .escape()
        .trim()
        .isInt().withMessage('lost_quantity must be an integer')
        .optional(),
    validationHandler.errorhandler
] 

exports.updateSanitization = [    
    param('id')
        .escape()
        .trim()
        .isInt().withMessage('Id must be an integer'),
    body('attack_id')
        .escape()
        .trim()
        .isInt().withMessage('attack_id must be an integer')
        .optional(),
    body('village_unit_id')
        .escape()
        .trim()
        .isInt().withMessage('village_unit_id must be an integer')
        .optional(),
    body('sent_quantity')
        .escape()
        .trim()
        .isInt().withMessage('sent_quantity must be an integer')
        .optional(),
    body('lost_quantity')
        .escape()
        .trim()
        .isInt().withMessage('lost_quantity must be an integer')
        .optional(),
    validationHandler.errorhandler
]

exports.idParamSanitization = [
    param('id')
        .escape()
        .trim()
        .isInt().withMessage('Id must be an integer'),
    validationHandler.errorhandler
]
