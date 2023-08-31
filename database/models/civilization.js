'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Civilization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Civilization.init({
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Civilization',
    tableName: 'civilization',
  });
  return Civilization;
};