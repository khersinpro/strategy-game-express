'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Building_cost extends Model {

    static associate(models) {
      this.belongsTo(models.Resource, {
        foreignKey: 'resource_name'
      })
      this.belongsTo(models.Building_level, {
        foreignKey: 'building_level_id'
      })
    }
  }

  Building_cost.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    resource_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'resource',
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
    indexes: [
      {
        unique: true,
        fields: ['resource_name', 'building_level_id']
      }
    ],
    sequelize,
    modelName: 'Building_cost',
    tableName: 'building_cost'
  });
  return Building_cost;
};