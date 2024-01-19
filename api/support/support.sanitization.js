const { param, checkSchema, checkExact } = require('express-validator');
const validationHandler = require('../../utils/validationHandler'); 

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
            supporting_village_id: {
                in: ['body'],
                errorMessage: 'supporting_village_id must be an integer',
                isInt: {
                    options: {
                        min: 1
                    }
                },
                trim: true,
                escape: true
            },
            supported_village_id: {
                in: ['body'],
                errorMessage: 'supported_village_id must be an integer',
                isInt: {
                    options: {
                        min: 1
                    }
                },
                trim: true,
                escape: true,
            },
            supporting_units: {
                in: ['body'],
                errorMessage: 'supporting_units must be an array',
                isArray: {
                    options: {
                        min: 1
                    }
                },
                trim: true,
                escape: true,
                exists: true
            },
            'supporting_units.*.village_unit_id': {
                in: ['body'],
                errorMessage: 'village_unit_id must be an integer',
                isInt: {
                    options: {
                        min: 1
                    }
                },
                trim: true,
                escape: true,
                exists: true
            },
            'supporting_units.*.sent_quantity': {
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
    ), 
    validationHandler.errorhandler
]

