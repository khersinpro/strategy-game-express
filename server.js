const express = require('express');
const NotFoundError = require('./errors/not-found');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const cors = require('cors');

// Import routers
const usersRouter = require('./api/user/user.router');
const roleRouter = require('./api/role/role.router');
const villageRouter = require('./api/village/village.router');
const serverRouter = require('./api/server/server.router');
const civilizationRouter = require('./api/civilization/civilization.router');
const unitRouter = require('./api/unit/unit.router');
const unitTypeRouter = require('./api/unit_type/unit_type.router');
const defenseTypeRouter = require('./api/defense_type/defense_type.router');
const buildingRouter = require('./api/building/building.router');
const infrastructureBuildingRouter = require('./api/building/town_all_building/town_all_building.router');
const militaryBuildingRouter = require('./api/building/military_building/military_building.router');
const ressourceBuildingRouter = require('./api/building/resource_building/resource_building.router');
const specialBuildingRouter = require('./api/building/special_building/special_building.router');
const wallBuildingRouter = require('./api/building/wall_building/wall_building.router');
const storageBuildingRouter = require('./api/building/storage_building/storage_building.router');
const wallDefenseRouter = require('./api/building/wall_defense/wall_defense.router');
const buildingCostRouter = require('./api/building/building_cost/building_cost.router');
const buildingLevelRouter = require('./api/building/building_level/building_level.router');
const resourceProductionRouter = require('./api/building/resource_production/resource_production.router');
const storageCapacityRouter = require('./api/building/storage_capacity/storage_capacity.router');
const villageBuildingRouter = require('./api/village/village_building/village_building.router');
const villageResourceRouter = require('./api/village/village_resource/village_resource.router');
const villageUnitRouter = require('./api/village/village_unit/village_unit.router');
const villageConstructionProgressRouter = require('./api/village/village_construction_progresss/village_construction_progresss.router');
const villageNewConstructionRouter = require('./api/village/village_new_construction/village_new_construction.router');
const villageUpdateConstructionRouter = require('./api/village/village_update_construction/village_update_construction.router');
const buildingTypeRouter = require('./api/building/building_type/building_type.router');
const mapRouter = require('./api/map/map.router');
const mapPositionRouter = require('./api/map/map_position/map_position.router');
const villageTrainingProgressRouter = require('./api/village/village_training_progress/village_training_progress.router');
const unitCostRouter = require('./api/unit/unit_cost/unit_cost.router');
const attackRouter = require('./api/attack/attack.router');
const attackUnitRouter = require('./api/attack/attack_attacker_unit/attack_attacker_unit.router');
const attackStatusRouter = require('./api/attack/attack_status/attack_status.router');
const supportRouter = require('./api/support/support.router');
const supportStatusRouter = require('./api/support/support_status/support_status.router');

const usersController = require('./api/user/user.controller');
const { auth } = require('./middlewares/auth');
const { loginSanitization } = require('./api/user/user.sanitization');

// Déclaration du serveur et configuration de socket.io
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
});

app.use((req, res, next) => {
    req.io = io;
    next();
})

app.use(cors());
app.use(express.json());

/**
 * Routes
 */
app.use('/api/user', auth, usersRouter);
app.use('/api/role', auth, roleRouter);
app.use('/api/village', auth, villageRouter);
app.use('/api/server', auth, serverRouter);
app.use('/api/civilization', auth, civilizationRouter);
app.use('/api/unit', auth, unitRouter);
app.use('/api/unit-type', auth, unitTypeRouter);
app.use('/api/defense-type', auth, defenseTypeRouter);
app.use('/api/building', auth, buildingRouter);
app.use('/api/town-all-building', auth, infrastructureBuildingRouter);
app.use('/api/military-building', auth, militaryBuildingRouter);
app.use('/api/ressource-building', auth, ressourceBuildingRouter);
app.use('/api/special-building', auth, specialBuildingRouter);
app.use('/api/wall-building', auth, wallBuildingRouter);
app.use('/api/storage-building', auth, storageBuildingRouter);
app.use('/api/wall-defense', auth, wallDefenseRouter);
app.use('/api/building-cost', auth, buildingCostRouter);
app.use('/api/building-level', auth, buildingLevelRouter);
app.use('/api/resource-production', auth, resourceProductionRouter);
app.use('/api/storage-capacity', auth, storageCapacityRouter);
app.use('/api/village-building', auth, villageBuildingRouter);
app.use('/api/village-resource', auth, villageResourceRouter);
app.use('/api/village-unit', auth, villageUnitRouter);
app.use('/api/village-construction-progress', auth, villageConstructionProgressRouter);
app.use('/api/village-new-construction', auth, villageNewConstructionRouter);
app.use('/api/village-update-construction', auth, villageUpdateConstructionRouter);
app.use('/api/building-type', auth, buildingTypeRouter);
app.use('/api/map', auth, mapRouter);
app.use('/api/map-position', auth, mapPositionRouter);
app.use('/api/village-training-progress', auth, villageTrainingProgressRouter);
app.use('/api/unit-cost', auth, unitCostRouter);
app.use('/api/attack', auth, attackRouter);
app.use('/api/attack-unit', auth, attackUnitRouter);
app.use('/api/attack-status', auth, attackStatusRouter);
app.use('/api/support', auth, supportRouter);
app.use('/api/support-status', auth, supportStatusRouter);


/**
 * Login route
 */
app.post('/api/login', loginSanitization, usersController.login)

app.use(express.static('public'));

/**
 * Middleware de gestion des erreurs 404
 */
app.use((req, res, next) => {
    next(new NotFoundError('Ressource introuvable'));
})

/**
 * Middleware de gestion d'erreur
 */
app.use((error, req, res, next) => {
    const status = error.status || 500;
    let message = error.message || 'Erreur interne au serveur';
    if (process.env.NODE_ENV === 'production')
    {
        message = 'Erreur interne au serveur';
    }
    res.status(status).json({ error: message });
})

module.exports = {
    app, server
};