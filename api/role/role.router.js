const express =  require('express')
const router = express.Router()
const RoleController = require('./role.controller')

router.get('/', RoleController.getAll)
router.get('/:name', RoleController.get)
router.post('/', RoleController.create)
router.put('/:name', RoleController.update)
router.delete('/:name', RoleController.delete)

module.exports = router