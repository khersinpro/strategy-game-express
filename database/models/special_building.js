'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Special_building extends Model {

    static associate(models) {
      this.belongsTo(models.Building, {
        foreignKey: 'name'
      })
      this.belongsTo(models.Civilization, {
        foreignKey: 'civilization-name'
      })
    }
  }
  Special_building.init({
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'buildings',
        key: 'name'
      }
    },
    civilization_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'civilization',
        key: 'name'
      }
    }
  }, {
    sequelize,
    modelName: 'Special_building',
    tableName: 'special_building'
  });
  return Special_building;
};