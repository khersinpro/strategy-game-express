'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Village_new_construction extends Model {
    static associate(models) {
      this.belongsTo(models.Village_construction_progress, {
        foreignKey: 'id'
      })
      this.belongsTo(models.Building, {
        foreignKey: 'building_name'
      })
      this.belongsTo(models.Building_level, {
        foreignKey: 'building_level_id'
      })
    }
  }

  Village_new_construction.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'village_construction_progress',
        key: 'id'
      }
    },
    building_name: {
      type:DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'building',
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
    sequelize,
    modelName: 'Village_new_construction',
    tableName: 'village_new_construction'
  });

  return Village_new_construction;
};