'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UnitType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UnitType.init({
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UnitType',
    tableName: 'unit_type',
  });
  return UnitType;
};