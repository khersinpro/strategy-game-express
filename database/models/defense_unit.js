'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class defense_unit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  defense_unit.init({
    sent_quantity: DataTypes.INTEGER,
    lost_quantity: DataTypes.INTEGER,
    attack_id: DataTypes.INTEGER,
    village_unit_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'defense_unit',
  });
  return defense_unit;
};