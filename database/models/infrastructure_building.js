'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Infrastructure_building extends Model {

    static associate(models) {
      this.belongsTo(models.Building, {
        foreignKey: 'name',
      });
    }
  }
  
  Infrastructure_building.init({
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
    modelName: 'Infrastructure_building',
    tableName: 'infrastructure_building'
  });

  return Infrastructure_building;
};