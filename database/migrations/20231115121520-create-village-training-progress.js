'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('village_training_progress', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      training_start: {
        type: Sequelize.DATE,
        allowNull: false
      },
      training_end: {
        type: Sequelize.DATE, 
        allowNull: false
      },
      unit_to_train_count: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      trained_unit_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0
      },
      single_training_duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      village_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'village',
          key: 'id'
        }
      },
      village_building_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'village_building',
          key: 'id'
        }
      },
      village_unit_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'village_unit',
          key: 'id'
        }
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: true
      },
      archived: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('village_training_progress');
  }
};