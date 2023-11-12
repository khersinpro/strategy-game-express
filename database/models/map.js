'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Map extends Model {
    static associate(models) {
      this.belongsTo(models.Server, {
        foreignKey: {
          name: 'serveur_name',
          allowNull: false,
        }
      })
    }
  }

  Map.init({
    serveur_name: {
      type: DataTypes.STRING,
      allowNull: false,
      reference: {
        model: 'serveur',
        key: 'name'
      }
    },
    x_area: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    y_area: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Map',
    tableName: 'map'
  });
  
  return Map;
};