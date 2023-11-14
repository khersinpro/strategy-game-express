'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Population_capacity extends Model {
    static associate(models) {
      this.belongsTo(models.Town_all_building, {
        foreignKey: 'town_all_building_name',
      });
      this.belongsTo(models.Building_level, {
        foreignKey: 'building_level_id',
        as: 'building_level'
      });
    }
  }
  
  Population_capacity.init({
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    town_all_building_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'town_all_building',
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
      fields: ['town_all_building_name', 'building_level_id']
    }],
    sequelize,
    modelName: 'Population_capacity',
    tableName: 'population_capacity'
  });

  return Population_capacity;
};