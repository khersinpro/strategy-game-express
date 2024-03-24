'use strict';
const Sequelize = require('sequelize');
const config    = require('../config/database.js');
const fs        = require('fs');
const path      = require('path');
const db        = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const modelsDirectory = path.join(__dirname, 'models');
const modelsFiles     = fs.readdirSync(modelsDirectory);
const models          = modelsFiles.map(file => require(path.resolve(modelsDirectory, file)));

models.forEach(model => {
    model.initialize(sequelize);
    db[model.name] = model;
})

models.forEach(model => {
    if (model.associate) {
        model.associate(db);
    }
})

db.models    = sequelize.models;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;