'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attack_defenser_support extends Model {
    static associate(models) {
      this.belongsTo(models.Attack, {
        foreignKey: 'attack_id',
      });
      this.belongsTo(models.Village_support, {
        foreignKey: 'village_support_id',
      });
    }
  }

  Attack_defenser_support.init({
    sent_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lost_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    attack_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'attack',
        key: 'id'
      }
    },
    village_support_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'village_support',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Attack_defenser_support',
    tableName: 'attack_defenser_support',
    indexes: [
      {
        unique: true,
        fields: ['attack_id', 'village_support_id']
      }
    ]
  });
  
  return Attack_defenser_support;
};