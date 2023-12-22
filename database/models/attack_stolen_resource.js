'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attack_stolen_resource extends Model {
    static associate(models) {
      this.belongsTo(models.Attack, {
        foreignKey: 'attack_id',
      });
      this.belongsTo(models.Resource, {
        foreignKey: 'resource_name',
      });
    }
  }

  Attack_stolen_resource.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    resource_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'resource',
        key: 'name'
      }
    },
    attack_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'attack',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Attack_stolen_resource',
    tableName: 'attack_stolen_resource',
    indexes: [
      {
        unique: true,
        fields: ['attack_id', 'resource_name']
      }
    ]
  });
  return Attack_stolen_resource;
};