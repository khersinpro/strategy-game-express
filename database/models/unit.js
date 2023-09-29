'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {

    static associate(models) {
      Unit.belongsTo(models.Unit_type, {
        foreignKey: 'type',
        as: 'unit_type'
      });
      Unit.hasMany(models.Defense_type, {
        foreignKey: 'unit_name',
        as: 'defense_type'
      });
    }
  }
  Unit.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    carrying: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Unit',
    tableName: 'unit',
  });
  return Unit;
};