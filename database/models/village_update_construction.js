'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Village_update_construction extends Model {
    static associate(models) {
      this.belongsTo(models.Village_construction_progress, {
        foreignKey: 'id'
      })
      this.belongsTo(models.Village_building, {
        foreignKey: 'village_building_id'
      })
      this.belongsTo(models.Building_level, {
        foreignKey: 'building_level_id'
      })
    }
  }

  Village_update_construction.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'village_construction_progress',
        key: 'id'
      }
    },
    village_building_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'village_building',
        key: 'id'
      }
    },
    building_level_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      reference: {
        model: 'building_level',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Village_update_construction',
    tableName: 'village_update_construction'
  });

  return Village_update_construction;
};