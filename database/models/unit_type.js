'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Unit_type extends Model {

    static associate(models) {
      Unit_type.hasMany(models.Unit, {
        foreignKey: 'type',
        as: 'unit_type'
      });
      Unit_type.hasMany(models.Defense_type, {
        foreignKey: 'type',
        as: 'defense_type'
      });
    }

  }
  Unit_type.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    }
  }, {
    sequelize,
    modelName: 'Unit_type',
    tableName: 'unit_type',
  });
  return Unit_type;
};