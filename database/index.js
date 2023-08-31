'use strict';
const Sequelize = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Récupération des models
const modelList = [
  require('./models/civilization'),
  require('./models/role'),
  require('./models/server'),
  require('./models/unittype'),
  require('./models/user'),
  require('./models/village'),
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