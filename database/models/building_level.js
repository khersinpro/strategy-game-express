'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Building_level extends Model {

    static associate(models) {
      this.belongsTo(models.Building, {
        foreignKey: 'building_name'
      })
    }
  }

  Building_level.init({
    building_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'building',
        key: 'name'
      }
    },
    level:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Building_level',
    tableName: 'building_level',
    indexes: [
      {
        unique: true,

        fields: ['building_name', 'level']
      }
    ]
  });

  return Building_level;
};