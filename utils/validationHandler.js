const { validationResult } = require('express-validator');

class ValidationHandler {
    errorhandler = (req, res, next) => {
    const errors = !validationResult(req).isEmpty() ? validationResult(req).mapped() : null;

        if (errors !== null) 
        { 
            return res.status(400).json({ errors });
        };
        
        next();
    }
}

module.exports = new ValidationHandler();