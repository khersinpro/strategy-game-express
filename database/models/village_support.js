'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Village_support extends Model {
    static associate(models) {
      this.belongsTo(models.Village, {
        foreignKey: 'supported_village_id',
        as: 'supported_village'
      });
      this.belongsTo(models.Village, {
        foreignKey: 'supporting_village_id',
        as: 'supporting_village'
      });
      this.belongsTo(models.Village_unit, {
        foreignKey: 'village_unit_id'
      });
    }
  }

  Village_support.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    supported_village_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'village',
        key: 'id'
      }
    },
    supporting_village_id: {
      type: DataTypes.INTEGER,
      aallowNull: false,
      references: {
        model: 'village',
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
    modelName: 'Village_support',
    tableName: 'village_support',
    validate: {
      async checkSameVillage() {
        if (this.supported_village_id && this.supporting_village_id && this.supported_village_id === this.supporting_village_id) {
          throw new Error('Village cannot support itself');
        }
      }
    }
  });

  return Village_support;
};