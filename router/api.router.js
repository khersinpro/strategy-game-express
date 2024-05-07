const express               = require('express');
const router                = express.Router();
const usersController       = require('./../api/user/user.controller');
const { auth }              = require('./../middlewares/auth');
const { loginSanitization } = require('./../api/user/user.sanitization');

/**
 * Import all api routers
 */
const usersRouter = require('./../api/user/user.router');
const roleRouter = require('./../api/role/role.router');              
const villageRouter = require('./../api/village/village.router');
const serverRouter = require('./../api/server/server.router');
const civilizationRouter = require('./../api/civilization/civilization.router');
const unitRouter = require('./../api/unit/unit.router');
const unitTypeRouter = require('./../api/unit_type/unit_type.router');
const defenseTypeRouter = require('./../api/defense_type/defense_type.router');
const buildingRouter = require('./../api/building/building.router');
const infrastructureBuildingRouter = require('./../api/building/town_all_building/town_all_building.router');
const militaryBuildingRouter = require('./../api/building/military_building/military_building.router');
const ressourceBuildingRouter = require('./../api/building/resource_building/resource_building.router');
const specialBuildingRouter = require('./../api/building/special_building/special_building.router');
const wallBuildingRouter = require('./../api/building/wall_building/wall_building.router');
const storageBuildingRouter = require('./../api/building/storage_building/storage_building.router');
const wallDefenseRouter = require('./../api/building/wall_defense/wall_defense.router');
const buildingCostRouter = require('./../api/building/building_cost/building_cost.router');
const buildingLevelRouter = require('./../api/building/building_level/building_level.router');
const resourceProductionRouter = require('./../api/building/resource_production/resource_production.router');
const storageCapacityRouter = require('./../api/building/storage_capacity/storage_capacity.router');
const villageBuildingRouter = require('./../api/village/village_building/village_building.router');
const villageResourceRouter = require('./../api/village/village_resource/village_resource.router');
const villageUnitRouter = require('./../api/village/village_unit/village_unit.router');
const villageConstructionProgressRouter = require('./../api/village/village_construction_progresss/village_construction_progresss.router');
const villageNewConstructionRouter = require('./../api/village/village_new_construction/village_new_construction.router');
const villageUpdateConstructionRouter = require('./../api/village/village_update_construction/village_update_construction.router');
const buildingTypeRouter = require('./../api/building/building_type/building_type.router');
const mapRouter = require('./../api/map/map.router');
const mapPositionRouter = require('./../api/map/map_position/map_position.router');
const villageTrainingProgressRouter = require('./../api/village/village_training_progress/village_training_progress.router');
const unitCostRouter = require('./../api/unit/unit_cost/unit_cost.router');
const attackRouter = require('./../api/attack/attack.router');
const attackUnitRouter = require('./../api/attack/attack_attacker_unit/attack_attacker_unit.router');
const attackStatusRouter = require('./../api/attack/attack_status/attack_status.router');
const supportRouter = require('./../api/support/support.router');
const supportStatusRouter = require('./../api/support/support_status/support_status.router');
const villageSupportRouter = require('./../api/support/supporting_unit/supporting_unit.router');
const resourceRouter = require('./../api/resource/resource.router');
const populationCapacityRouter = require('./../api/building/population_capacity/population_capaticity.router');
const unitProduction = require('../api/building/unit_production/unit_production.router');


/**
 * Login route without auth middleware
 */
router.post('/api/login', loginSanitization, usersController.login)

/**
 * All api routes with auth middleware 
 */
router.use('/api/user', auth, usersRouter);  
router.use('/api/role', auth, roleRouter);
router.use('/api/village', auth, villageRouter);
router.use('/api/server', auth, serverRouter);
router.use('/api/civilization', auth, civilizationRouter);
router.use('/api/unit', auth, unitRouter);
router.use('/api/unit-type', auth, unitTypeRouter);
router.use('/api/defense-type', auth, defenseTypeRouter);
router.use('/api/building', auth, buildingRouter);
router.use('/api/town-all-building', auth, infrastructureBuildingRouter);
router.use('/api/military-building', auth, militaryBuildingRouter);
router.use('/api/ressource-building', auth, ressourceBuildingRouter);
router.use('/api/special-building', auth, specialBuildingRouter);
router.use('/api/wall-building', auth, wallBuildingRouter);
router.use('/api/storage-building', auth, storageBuildingRouter);
router.use('/api/wall-defense', auth, wallDefenseRouter);
router.use('/api/building-cost', auth, buildingCostRouter);
router.use('/api/building-level', auth, buildingLevelRouter);
router.use('/api/resource-production', auth, resourceProductionRouter);
router.use('/api/storage-capacity', auth, storageCapacityRouter);
router.use('/api/village-building', auth, villageBuildingRouter);
router.use('/api/village-resource', auth, villageResourceRouter);
router.use('/api/village-unit', auth, villageUnitRouter);
router.use('/api/village-construction-progress', auth, villageConstructionProgressRouter);
router.use('/api/village-new-construction', auth, villageNewConstructionRouter);
router.use('/api/village-update-construction', auth, villageUpdateConstructionRouter);
router.use('/api/building-type', auth, buildingTypeRouter);
router.use('/api/map', auth, mapRouter);
router.use('/api/map-position', auth, mapPositionRouter);
router.use('/api/village-training-progress', auth, villageTrainingProgressRouter);
router.use('/api/unit-cost', auth, unitCostRouter);
router.use('/api/attack', auth, attackRouter);
router.use('/api/attack-unit', auth, attackUnitRouter);
router.use('/api/attack-status', auth, attackStatusRouter);
router.use('/api/support', auth, supportRouter);
router.use('/api/support-status', auth, supportStatusRouter);
router.use('/api/village-support', auth, villageSupportRouter);
router.use('/api/resource', auth, resourceRouter);
router.use('/api/population-capacity', auth, populationCapacityRouter);
router.use('/api/unit-production', auth, unitProduction);

module.exports = router;