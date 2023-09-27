'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Civilization extends Model {
    static associate(models) {
      this.hasMany(models.Village, {
        foreignKey: 'civilization_type'
      })
    }
  }
  Civilization.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    }
  }, {
    sequelize,
    modelName: 'Civilization',
    tableName: 'civilization',
  });
  return Civilization;
};