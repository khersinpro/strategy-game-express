'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attack_unit extends Model {
    static associate(models) {
      this.belongsTo(models.Attack, {
        foreignKey: 'attack_id',
      });
      this.belongsTo(models.Village_unit, {
        foreignKey: 'village_unit_id',
      });
    }
  }

  Attack_unit.init({
    attack_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'attack',
        key: 'id'
      }
    },
    village_unit_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'village_unit',
        key: 'id'
      }
    },
    sent_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lost_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    } 
  }, {
    sequelize,
    modelName: 'Attack_unit',
    tableName: 'attack_unit'
  }, {
    uniqueKeys: {
      unique_attack_unit: {
        fields: ['attack_id', 'village_unit_id']
      }
    }
  });

  return Attack_unit;
};