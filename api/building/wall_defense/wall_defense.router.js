const express = require('express');
const router = express.Router();
const WallDefenseController = require('./wall_defense.controller');
const { isAdmin } = require('../../../middlewares/auth');
const { idParamSanitization, createSanitization, updateSanitization } = require('./wall_defense.sanitization');
const { nameParamSanitization } = require('../building.sanitization');

/********************************************
 * Auth routes
 *******************************************/
router.get('/:id', idParamSanitization, WallDefenseController.get);
router.get('/levels/:name', nameParamSanitization, WallDefenseController.getAllWithLevelByBuildingName);

/****************************************
 * Admin routes
****************************************/
router.get('/',isAdmin, WallDefenseController.getAll);
router.post('/', isAdmin, createSanitization, WallDefenseController.create);
router.put('/:id', isAdmin, updateSanitization, WallDefenseController.update);
router.delete('/:id', isAdmin, idParamSanitization, WallDefenseController.delete);

module.exports = router;