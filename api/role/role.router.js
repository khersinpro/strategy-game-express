const express =  require('express')
const router = express.Router()
const RoleController = require('./role.controller')
const { createSanitization, updateSanitization, nameParamSanitization } = require('./role.sanitization')

router.get('/', RoleController.getAll)
router.get('/:name', nameParamSanitization, RoleController.get)
router.post('/', createSanitization, RoleController.create)
router.put('/:name', updateSanitization, RoleController.update)
router.delete('/:name', nameParamSanitization, RoleController.delete)

module.exports = router