'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Civilization extends Model {

    static associate(models) {
      this.hasMany(models.Village, {
        foreignKey: 'civilization_name'
      })
      this.hasMany(models.Unit, {
        foreignKey: 'civilization_name'
      })  
      this.hasMany(models.Special_building, {
        foreignKey: 'civilization_name'
      })
      this.hasMany(models.Wall_building, {
        foreignKey: 'civilization_name'
      })
    }
  }
  
  Civilization.init({
    name: {
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