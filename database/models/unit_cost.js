'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Unit_cost extends Model {
    static associate(models) {
      this.belongsTo(models.Unit, {
        foreignKey: 'unit_name'
      })
      this.belongsTo(models.Resource, {
        foreignKey: 'resource_name'
      })
    }
  }

  Unit_cost.init({
    unit_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'unit',
        key: 'name'
      }
    },
    resource_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'resource',
        key: 'name'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Unit_cost',
    tableName: 'unit_cost',
    indexes: [
      {
        unique: true,
        fields: ['unit_name', 'resource_name']
      }
    ]
  });

  return Unit_cost;
};