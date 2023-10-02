const express = require('express')
const router = express.Router()
const unitController = require('./unit.controller')
const { createSanitization, updateSanitization, nameParamSanitization } = require('./unit.sanitization')
const { isAdmin } = require('../../middlewares/auth')

/**
 * Auth routes
 */
router.get('/', unitController.getAll)
router.get('/:name', nameParamSanitization, unitController.get)

/**
 * Admin routes
 */
router.post('/', isAdmin, createSanitization, unitController.create)
router.put('/:name', isAdmin, updateSanitization, unitController.update)
router.delete('/:name', isAdmin, nameParamSanitization, unitController.delete)


module.exports = router