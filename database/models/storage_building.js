'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Storage_building extends Model {
    static associate(models) {
      this.belongsTo(models.Building, {
        foreignKey: 'name'
      });
      this.belongsTo(models.Resource, {
        foreignKey: 'resource_name'
      });
      this.hasMany(models.Storage_capacity, {
        foreignKey: 'storage_building_name'
      });
    }
  }

  Storage_building.init({
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'building', 
        key: 'name'
      }
    },
    resource_name: {
      type: DataTypes.STRING,
      allowNUll: false,
      references: {
        model: 'resource',
        key: 'name'
      }
    }
  }, {
    sequelize,
    modelName: 'Storage_building',
    tableName: 'storage_building'
  });

  return Storage_building;
};