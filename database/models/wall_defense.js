'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Wall_defense extends Model {
    static associate(models) {
      this.belongsTo(models.Wall_building, {
        foreignKey: 'wall_building_name'
      })
      this.belongsTo(models.Building_level, {
        foreignKey: 'building_level_id'
      })
    }
  }

  Wall_defense.init({
    defense_percent: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wall_building_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'wall_building',
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
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['wall_building_name', 'building_level_id']
      }
    ],
    sequelize,
    modelName: 'Wall_defense',
    tableName: 'wall_defense'
  });
  return Wall_defense;
};