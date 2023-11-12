'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Map_position extends Model {
    static associate(models) {
      this.belongsTo(models.Map, {
        foreignKey: 'map_id',
        as: 'map'
      });
      // polymorphic association with village
      this.belongsTo(models.Village, {
        foreignKey: 'target_entity_id',
        constraints: false,
        as: 'village',
        scope: {
          target_type: 'village'
        },
      });
    }
  }

  Map_position.init({
    map_id: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      references: {
        model: 'map',
        key: 'id'
      }
    },
    x: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    y: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    target_entity_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    target_type: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Map_position',
    tableName: 'map_position',
  });

  return Map_position;
};