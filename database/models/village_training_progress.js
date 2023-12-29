'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Village_training_progress extends Model {
    /**
     * List of all associations
     */
    static associate(models) {
      this.belongsTo(models.Village, {
        foreignKey: 'village_id'
      });
      this.belongsTo(models.Village_building, {
        foreignKey: 'village_building_id'
      });
      this.belongsTo(models.Village_unit, {
        foreignKey: 'village_unit_id'
      });
    }
    /**
     * List of all class methods
     */

    /**
     * Return the total unit trained since the beginning of the training
     * @param {Date} endDateLimit - The end of the count of units trained
     * @returns {Number} - total unit trained since the beginning of the training
     */
    getTotalsUnitsTrained(endDateLimit = new Date()) {
      const startDate                     = new Date(this.training_start);
      const endDate                       = this.training_end >= endDateLimit ? endDateLimit : new Date(this.training_end);
      const diffInSec                     = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
      const singleUnitTrainingDuration    = this.single_training_duration;
      const totalUnitCreated              = Math.floor(diffInSec / singleUnitTrainingDuration);
      return totalUnitCreated;
    }

    /**
     * Return the number of unit trained to create since last update
     * @param {Date} lastUpdateDate - The last update date 
     * @returns {Number} - count of unit trained to create since last update
     */
    getUnitCountTrainedSinceLastUpdate(lastUpdateDate = new Date()) {
      const totalUnitCreated = this.getTotalsUnitsTrained(lastUpdateDate);
      const unitToCreate     = totalUnitCreated - this.trained_unit_count;
      return unitToCreate;
    }
  }

  Village_training_progress.init({
    training_start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    training_end: {
      type: DataTypes.DATE,
      allowNull: false
    },
    unit_to_train_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    trained_unit_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    single_training_duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    village_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'village',
        key: 'id'
      }
    },
    village_building_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'village_building',
        key: 'id'
      }
    },
    village_unit_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'village_unit',
        key: 'id'
      }
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    archived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Village_training_progress',
    tableName: 'village_training_progress'
  });

  return Village_training_progress;
};