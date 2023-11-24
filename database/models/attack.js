'use strict';
const { Model } = require('sequelize');
const ForbiddenError = require('../../errors/forbidden');

module.exports = (sequelize, DataTypes) => {
  class Attack extends Model {
    static associate(models) {
      this.belongsTo(models.Village, {
        foreignKey: 'attacked_village_id',
        as: 'attacked_village'
      });
      this.belongsTo(models.Village, {
        foreignKey: 'attacking_village_id',
        as: 'attacking_village'
      });
      this.belongsTo(models.Attack_status, {
        foreignKey: 'attack_status',
      });
      this.hasMany(models.Attack_unit, {
        foreignKey: 'attack_id',
      });
    }
  }

  Attack.init({
    attacked_village_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'village',
        key: 'id'
      }
    },
    attacking_village_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'village',
        key: 'id'
      }
    },
    departure_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    arrival_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    return_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    attacker_report: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    attacked_report: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    attack_status: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'attack_status',
        key: 'name'
      }
    }
  }, {
    sequelize,
    modelName: 'Attack',
    tableName: 'attack',
    indexes: [
      {
        unique: true,
        fields: ['attacked_village_id', 'attacking_village_id', 'departure_date']
      }
    ],
    validate: {
      attackedAndAttackingVillagesMustBeDifferent() {
        if (this.attacked_village_id && this.attacking_village_id && this.attacked_village_id === this.attacking_village_id) {
          throw new ForbiddenError('Attacked and attacking villages must be different');
        }
        console.log("valide");
      }
    }
  });

  return Attack;
};