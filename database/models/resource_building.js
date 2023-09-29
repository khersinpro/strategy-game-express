'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Resource_building extends Model {

    static associate(models) {
      this.belongsTo(models.Building, {
        foreignKey: 'name'
      })
    }

  }
  Resource_building.init({
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
    modelName: 'Resource_building',
    tableName: 'resource_building'
  });
  return Resource_building;
};