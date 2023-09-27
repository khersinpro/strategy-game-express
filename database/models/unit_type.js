'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Unit_type extends Model {

    static associate(models) {

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