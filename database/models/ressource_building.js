'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ressource_building extends Model {

    static associate(models) {
      this.belongsTo(models.Building, {
        foreignKey: 'name'
      })
    }

  }
  Ressource_building.init({
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
    modelName: 'Ressource_building',
    tableName: 'ressource_building'
  });
  return Ressource_building;
};