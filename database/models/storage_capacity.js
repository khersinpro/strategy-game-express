'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Storage_capacity extends Model {
    static associate(models) {
      this.belongsTo(models.Storage_building, {
        foreignKey: 'storage_building_name',
        as: 'storage_building'
      });
      this.belongsTo(models.Building_level, {
        foreignKey: 'building_level_id',
        as: 'building_level'
      });
    }
  }
  
  Storage_capacity.init({
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    storage_building_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'storage_building',
        key: 'name'
      }
    },
    building_level_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'building_level',
        key: 'id'
      }
    }
  }, {
    indexes: [{
      unique: true,
      fields: ['storage_building_name', 'building_level_id']
    }],
    sequelize,
    modelName: 'Storage_capacity',
    tableName: 'storage_capacity'
  });

  return Storage_capacity;
};