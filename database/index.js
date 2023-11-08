'use strict';
const Sequelize = require('sequelize');
const config = require('../config/database.js');
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);


// Récupération des models
const modelList = [
  require('./models/civilization'),
  require('./models/role'),
  require('./models/server'),
  require('./models/unit_type'),
  require('./models/user'),
  require('./models/village'),
  require('./models/building_type.js'),
  require('./models/building'),
  require('./models/resource_building'),
  require('./models/special_building'),
  require('./models/wall_building'),
  require('./models/infrastructure_building'),
  require('./models/military_building'),
  require('./models/unit'),
  require('./models/defense_type'),
  require('./models/resource'),
  require('./models/building_level'),
  require('./models/building_cost'),
  require('./models/resource_production'),
  require('./models/unit_production'),
  require('./models/village_resource'),
  require('./models/village_unit'),
  require('./models/village_building'),
  require('./models/storage_building'),
  require('./models/storage_capacity'),
  require('./models/wall_defense'),
  require('./models/village_construction_progress.js'),
  require('./models/village_new_construction.js'),
  require('./models/village_update_construction.js')
];

// Déclaration des models a sequelize
modelList.forEach(model  => model(sequelize, Sequelize.DataTypes));

// Déclaration des associations
Object.values(sequelize.models)
.filter(model => typeof model.associate === "function")
.forEach(model => model.associate(sequelize.models));

db.models = sequelize.models;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;