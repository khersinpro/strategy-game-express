'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class village_support extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  village_support.init({
    quantity: DataTypes.INTEGER,
    supported_village_id: DataTypes.INTEGER,
    supporting_village_id: DataTypes.INTEGER,
    village_unit_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'village_support',
  });
  return village_support;
};