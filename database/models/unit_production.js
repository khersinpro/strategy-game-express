'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Unit_production extends Model {
    static associate(models) {
      this.belongsTo(models.Military_building, {
        foreignKey: 'military_building_name'
      })
      this.belongsTo(models.Building_level, {
        foreignKey: 'building_level_id'
      })
    }
  }

  Unit_production.init({
    reduction_percent: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    military_building_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'military_building',
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
        fields: ['military_building_name', 'building_level_id']
      }
    ],
    sequelize,
    modelName: 'Unit_production',
    tableName: 'unit_production'
  });
  return Unit_production;
};