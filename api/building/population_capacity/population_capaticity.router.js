const express = require('express')
const router = express.Router()
const { isAdmin } = require('../../../middlewares/auth')
const { getAll, getAllWithLevelByBuildingName, getById, create, deletePopulationCapacity, update } = require('./population_capaticity.controller')
const { idParamSanitization, createSanitization, updateSanitization } = require('./population_capaticity.sanitization')
const { nameParamSanitization } = require('../building.sanitization');
/*********************************************************
 * Auth routes
 ********************************************************/
router.get('/:id', idParamSanitization, getById)
router.get('/levels/:name', nameParamSanitization, getAllWithLevelByBuildingName)

/*********************************************************
 * Admin routes
 ********************************************************/
router.get('/', isAdmin, getAll);
router.post('/', isAdmin, createSanitization, create)
router.put('/:id', isAdmin, idParamSanitization, updateSanitization, update)
router.delete('/:id', isAdmin, idParamSanitization, deletePopulationCapacity)

module.exports = router