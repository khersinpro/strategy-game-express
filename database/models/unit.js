'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {

    static associate(models) {
      Unit.belongsTo(models.Unit_type, {
        foreignKey: 'unit_type',
      });
      Unit.hasMany(models.Defense_type, {
        foreignKey: 'unit_name',
      });
      Unit.belongsTo(models.Civilization, {
        foreignKey: 'civilization_type',
      });
      Unit.belongsTo(models.Military_building, {
        foreignKey: 'name',
      });
    }
  }
  Unit.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    atk: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    carrying: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unit_type: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'unit_type',
        key: 'type'
      }
    },
    civilization_type: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'civilization',
        key: 'type'
      }
    },
    military_building: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'military_building',
        key: 'name'
      }
    },
  }, {
    sequelize,
    modelName: 'Unit',
    tableName: 'unit',
  });
  return Unit;
};