'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Building_level extends Model {

    static associate(models) {
      this.belongsTo(models.Building, {
        foreignKey: 'building_name'
      })
      this.hasMany(models.Resource_production, {
        foreignKey: 'building_level_id'
      })
      this.hasMany(models.Building_cost, {
        foreignKey: 'building_level_id'
      })
      this.hasMany(models.Village_building, {
        foreignKey: 'building_level_id'
      })
      this.hasMany(models.Storage_capacity, {
        foreignKey: 'building_level_id'
      })
    }
  }

  Building_level.init({
    building_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'building',
        key: 'name'
      }
    },
    level:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Building_level',
    tableName: 'building_level',
    indexes: [
      {
        unique: true,
        fields: ['building_name', 'level']
      }
    ]
  });

  return Building_level;
};