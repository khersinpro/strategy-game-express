const { body, param, checkSchema, checkExact } = require('express-validator');
const validationHandler = require('../../utils/validationHandler'); 


exports.generateSanitization = [
    checkExact(
        checkSchema({
            attackedVillageId: {
                in: ['body'],
                errorMessage: 'attackedVillageId must be an integer',
                isInt: true,
                trim: true,
                escape: true
            },
            attackingVillageId: {
                in: ['body'],
                errorMessage: 'attackingVillageId must be an integer',
                isInt: true,
                trim: true,
                escape: true,
            },
            villageUnits: {
                in: ['body'],
                errorMessage: 'villageUnits must be an array',
                isArray: {
                    options: {
                        min: 1
                    }
                },
                trim: true,
                escape: true,
                exists: true
            },
            'villageUnits.*.id': {
                in: ['body'],
                errorMessage: 'id must be an integer',
                isInt: true,
                trim: true,
                escape: true,
                exists: true
            },
            'villageUnits.*.quantity': {
                in: ['body'],
                errorMessage: 'quantity must be an integer',
                isInt: true,
                trim: true,
                escape: true,
                exists: true
            }, 
        }), { message: 'Invalid fields in request body'}
    ), 
    validationHandler.errorhandler
]


exports.idParamSanitization = [
    param('id')
        .escape()
        .trim()
        .isInt().withMessage('Id must be an integer'),
    validationHandler.errorhandler
]

/**
 * For Admin routes
 */

exports.createSanitization = [
    body('attacked_village_id')
        .escape()
        .trim()
        .isInt().withMessage('attacked_village_id must be an integer'),
    body('attacking_village_id')
        .escape()
        .trim()
        .isInt().withMessage('attacking_village_id must be an integer'),
    body('departure_date')
        .escape()
        .trim()
        .isDate().withMessage('departure_date must be a date'),
    body('arrival_date')
        .escape()
        .trim()
        .isDate().withMessage('arrival_date must be a date'),
    body('return_date')
        .escape()
        .trim()
        .isDate().withMessage('return_date must be a date')
        .optional(),
    body('attacker_report')
        .escape()
        .trim()
        .isBoolean().withMessage('attacker_report must be a boolean')
        .optional(),
    body('attacked_report')
        .escape()
        .trim()
        .isBoolean().withMessage('attacked_report must be a boolean')
        .optional(),
    body('attack_status')
        .escape()
        .trim()
        .isString().withMessage('attack_status must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('attack_status must not be empty'),
    validationHandler.errorhandler
] 

exports.updateSanitization = [    
    param('id')
        .escape()
        .trim()
        .isInt().withMessage('Id must be an integer'),
    body('attacked_village_id')
        .escape()
        .trim()
        .isInt().withMessage('attacked_village_id must be an integer')
        .optional(),
    body('attacking_village_id')
        .escape()
        .trim()
        .isInt().withMessage('attacking_village_id must be an integer')
        .optional(),
    body('departure_date')
        .escape()
        .trim()
        .isDate().withMessage('departure_date must be a date')
        .optional(),
    body('arrival_date')
        .escape()
        .trim()
        .isDate().withMessage('arrival_date must be a date')
        .optional(),
    body('return_date')
        .escape()
        .trim()
        .isDate().withMessage('return_date must be a date')
        .optional(),
    body('attacker_report')
        .escape()
        .trim()
        .isBoolean().withMessage('attacker_report must be a boolean')
        .optional(),
    body('attacked_report')
        .escape()
        .trim()
        .isBoolean().withMessage('attacked_report must be a boolean')
        .optional(),
    body('attack_status')
        .escape()
        .trim()
        .isString().withMessage('attack_status must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('attack_status must not be empty')
        .optional(),
    validationHandler.errorhandler
]