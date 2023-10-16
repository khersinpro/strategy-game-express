'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Building extends Model {

    static associate(models) {
      this.hasOne(models.Infrastructure_building, {
        foreignKey: 'name',
        onDelete: 'CASCADE'
      });
      this.hasOne(models.Military_building, {
        foreignKey: 'name',
        onDelete: 'CASCADE'
      });
      this.hasOne(models.Resource_building, {
        foreignKey: 'name',
        onDelete: 'CASCADE'
      });
      this.hasOne(models.Wall_building, {
        foreignKey: 'name',
        onDelete: 'CASCADE'
      });
      this.hasOne(models.Special_building, {
        foreignKey: 'name',
        onDelete: 'CASCADE'
      });
      this.hasOne(models.Storage_building, {
        foreignKey: 'name',
        onDelete: 'CASCADE'
      });
      this.hasMany(models.Building_level, {
        foreignKey: 'building_name',
        as: 'levels'
      });
    }
  }
  
  Building.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM(
        'infrastructure_building', 
        'military_building', 
        'ressource_building', 
        'storage_building',
        'wall_building', 
        'special_building'
      ),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Building',
    tableName: 'building'
  });
  
  return Building;
};