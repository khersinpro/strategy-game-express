const { body, checkSchema, checkExact, param } = require('express-validator');
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
            name: {
                in: ['body'],
                errorMessage: 'Name must be a string',
                escape: true,
                trim: true,
                isString: true,
                isLength: {
                    options: {
                        min: 3
                    }
                },
            }
        }), { message: 'Invalid fields in request body'}
    ),
    validationHandler.errorhandler
]