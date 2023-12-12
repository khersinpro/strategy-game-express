'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Defense_unit extends Model {
    static associate(models) {
      this.belongsTo(models.Attack, {
        foreignKey: 'attack_id',
      });
      this.belongsTo(models.Village_unit, {
        foreignKey: 'village_unit_id',
      });
    }
  }
  
  Defense_unit.init({
    sent_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lost_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
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
    }
  }, {
    sequelize,
    modelName: 'Defense_unit',
    tableName: 'defense_unit',
    indexes: [
      // {
      //   unique: true,
      //   // fields: ['attack_id', 'village_unit_id']
      // }
    ]
  });

  return Defense_unit;
};