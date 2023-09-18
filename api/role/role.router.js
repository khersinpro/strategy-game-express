const express =  require('express')
const router = express.Router()
const RoleController = require('./role.controller')
const { createSanitization, updateSanitization, nameParamSanitization } = require('./role.sanitization')
const { isAdmin } = require('../../middlewares/auth')

router.get('/', isAdmin, RoleController.getAll)
router.get('/:name', isAdmin, nameParamSanitization, RoleController.get)
router.post('/', isAdmin, createSanitization, RoleController.create)
router.put('/:name', isAdmin, updateSanitization, RoleController.update)
router.delete('/:name', isAdmin, nameParamSanitization, RoleController.delete)

module.exports = router