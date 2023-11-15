'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Town_all_building extends Model {

    static associate(models) {
      this.belongsTo(models.Building, {
        foreignKey: 'name',
      });
    }
  }

  Town_all_building.init({
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'buildings',
        key: 'name'
      }
    },
  }, {
    sequelize,
    modelName: 'Town_all_building',
    tableName: 'town_all_building'
  });

  return Town_all_building;
};