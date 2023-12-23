'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Village_unit extends Model {
    static associate(models) {
      this.belongsTo(models.Village, {
        foreignKey: 'village_id',
      });
      this.belongsTo(models.Unit, {
        foreignKey: 'unit_name',
      });
      this.hasMany(models.Attack_attacker_unit, {
        foreignKey: 'village_unit_id',
      });
      this.hasMany(models.Village_support, {
        foreignKey: 'village_unit_id',
      });
      this.hasMany(models.Attack_defenser_unit, {
        foreignKey: 'village_unit_id',
      });    
    }
  }

  Village_unit.init({
    village_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'village',
        key: 'id'
      }
    },
    unit_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'unit',
        key: 'name'
      }
    },
    total_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    present_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    in_attack_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    in_support_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['village_id', 'unit_name']
      }
    ],
    sequelize,
    modelName: 'Village_unit',
    tableName: 'village_unit'
  });

  return Village_unit;
};