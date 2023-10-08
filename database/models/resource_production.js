'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resource_production extends Model {

    static associate(models) {
      this.belongsTo(models.Resource_building, {
        foreignKey: 'resource_building_name'
      })
      this.belongsTo(models.Building_level, {
        foreignKey: 'building_level_id'
      })
    }
  }

  Resource_production.init({
    production: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    resource_building_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'resource_building',
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
        fields: ['resource_building_name', 'building_level_id']
      }
    ],
    sequelize,
    modelName: 'Resource_production',
    tableName: 'resource_production'
  });

  return Resource_production;
};