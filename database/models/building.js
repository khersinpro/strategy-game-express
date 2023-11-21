'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Building extends Model {

    static associate(models) {
      this.hasOne(models.Town_all_building, {
        foreignKey: 'name',
        onDelete: 'CASCADE'
      });
      this.hasOne(models.Military_building, {
        foreignKey: 'name',
        onDelete: 'CASCADE'
      });
      this.hasOne(models.Resource_building, {
        foreignKey: 'name',
        onDelete: 'CASCADE'
      });
      this.hasOne(models.Wall_building, {
        foreignKey: 'name',
        onDelete: 'CASCADE'
      });
      this.hasOne(models.Special_building, {
        foreignKey: 'name',
        onDelete: 'CASCADE'
      });
      this.hasOne(models.Storage_building, {
        foreignKey: 'name',
        onDelete: 'CASCADE'
      });
      this.belongsTo(models.Building_type, {
        foreignKey: 'type',
      });
      this.hasMany(models.Building_level, {
        foreignKey: 'building_name',
        as: 'levels'
      });
    }

    /**
     * Methods
     */

    /**
     * Get the herited building if is_common is false
     * @returns {Promise<> | null}
     */
    async getHeritedBuilding() {
      try
      {
        if (this.is_common) {
          return null;
        }

        const buildingType =  this.type.charAt(0).toUpperCase() + this.type.slice(1);

        const heritedBuilding = await sequelize.models[buildingType].findOne({
          where: {
            name: this.name
          }
        });
  
        return heritedBuilding;
      }
      catch (error)
      {
        throw error;
      }
    }

    /**
     * Get the civilization of herited building if is_common is false
     * @returns {Promise<> | null}
     */
    async getCivilization() {
      try
      {
        if (this.is_common) {
          return null;
        }
  
        const heritedBuilding = await this.getHeritedBuilding();
        return heritedBuilding.civilization_name;
      }
      catch (error)
      {
        throw error;
      }
    }
  }
  
  Building.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      references: {
        model: 'building_type',
        key: 'name'
      },
      allowNull: false
    },
    is_common: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Building',
    tableName: 'building'
  });
  
  return Building;
};