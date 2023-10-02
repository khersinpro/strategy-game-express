'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Building extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Infrastructure_building, {
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
    }
  }
  Building.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('infrastructure_building', 'military_building', 'ressource_building', 'wall_building', 'special_building'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Building',
    tableName: 'building'
  });
  return Building;
};