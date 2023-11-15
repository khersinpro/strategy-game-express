'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resource extends Model {

    static associate(models) {
      this.hasMany(models.Building_cost, {
        foreignKey: 'resource_name'
      })
      this.hasMany(models.Unit_cost, {
        foreignKey: 'resource_name'
      })
    }
  }

  Resource.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'Resource',
    tableName: 'resource'
  });
  
  return Resource;
};