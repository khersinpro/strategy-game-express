'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wall_building extends Model {

    static associate(models) {
      this.belongsTo(models.Building, {
        foreignKey: 'name',
      });
    }

  }
  Wall_building.init({
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
    modelName: 'Wall_building',
    tableName: 'wall_building'
  });
  return Wall_building;
};