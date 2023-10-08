'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Defense_type extends Model {

    static associate(models) {
      Defense_type.belongsTo(models.Unit, {
        foreignKey: 'unit_name',
      });
      Defense_type.belongsTo(models.Unit_type, {
        foreignKey: 'type',
      });
    }
  }
  
  Defense_type.init({
    unit_name: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'unit',
        key: 'name'
      }
    },
    type: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'unit_type',
        key: 'type'
      }
    },
    defense_value: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Defense_type',
    tableName: 'defense_type',
  });

  return Defense_type;
};