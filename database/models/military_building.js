'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Military_building extends Model {
    
    static associate(models) {
      this.belongsTo(models.Building, {
        foreignKey: 'name'
      })
      this.hasMany(models.Unit, {
        foreignKey: 'military_building'
      })
      this.belongsTo(models.Unit_type, {
        foreignKey: 'unit_type'
      })  
    }    
  }

  Military_building.init({
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'buildings',
        key: 'name'
      }
    },
    unit_type: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'unit_type',
        key: 'type'
      }
    }
  }, {
    sequelize,
    modelName: 'Military_building',
    tableName: 'military_building'
  });
  
  return Military_building;
};