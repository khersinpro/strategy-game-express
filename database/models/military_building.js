'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Military_building extends Model {
    
    static associate(models) {
      this.belongsTo(models.Building, {
        foreignKey: 'name'
      })
      this.hasMany(models.Unit, {
        foreignKey: 'military_building'
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
  }, {
    sequelize,
    modelName: 'Military_building',
    tableName: 'military_building'
  });
  return Military_building;
};