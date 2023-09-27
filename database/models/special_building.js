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
  }, {
    sequelize,
    modelName: 'Special_building',
    tableName: 'special_building'
  });
  return Special_building;
};