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
      this.belongsTo(models.Resource, {
        foreignKey: 'resource_name'
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
    resource_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'resource',
        key: 'name'
      }
    }
  }, {
    sequelize,
    modelName: 'Resource_building',
    tableName: 'resource_building'
  });
  return Resource_building;
};