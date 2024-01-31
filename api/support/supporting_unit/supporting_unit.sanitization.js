const { param, checkSchema, checkExact, body } = require('express-validator');
const validationHandler = require('../../../utils/validationHandler');

exports.idParamSanitization = [ 
    param('id')
        .escape()
        .trim()
        .isInt().withMessage('Id must be an integer'),
    validationHandler.errorhandler
]

exports.createSanitization = [
    checkExact(
        checkSchema({
            support_id: {
                in: ['body'],
                errorMessage: 'support_id must be an integer',
                isInt: {
                    options: {
                        min: 1
                    }
                },
                trim: true,
                escape: true
            },
            village_unit_id: {
                in: ['body'],
                errorMessage: 'village_unit_id must be an integer',
                isInt: {
                    options: {
                        min: 1
                    }
                },
                trim: true,
                escape: true,
            },
            sent_quantity: {
                in: ['body'],
                errorMessage: 'sent_quantity must be an integer',
                isInt: {
                    options: {
                        min: 1
                    }
                },
                trim: true,
                escape: true,
                exists: true
            },
        }), { message: 'Invalid fields in request body'}
    ), validationHandler.errorhandler
]

exports.updateSanitization = [
    param('id')
        .escape()
        .trim()
        .isInt().withMessage('Id must be an integer'),
    body('support_id')
        .optional()
        .escape()
        .trim()
        .isInt().withMessage('support_id must be an integer'),
    body('village_unit_id')
        .optional()
        .escape()
        .trim()
        .isInt().withMessage('village_unit_id must be an integer'),
    body('sent_quantity')
        .optional()
        .escape()
        .trim()
        .isInt().withMessage('sent_quantity must be an integer'),
    body('present_quantity')
        .optional()
        .escape()
        .trim()
        .isInt().withMessage('present_quantity must be an integer'),
    validationHandler.errorhandler
]