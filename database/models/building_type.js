'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Building_type extends Model {

    static associate(models) {
      this.hasMany(models.Building, {
        foreignKey: 'type'
      })
      this.hasMany(models.Village_building, {
        foreignKey: 'type'
      })
    }
  }
  
  Building_type.init({
    name: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'Building_type',
    tableName: 'building_type'
  });

  return Building_type;
};