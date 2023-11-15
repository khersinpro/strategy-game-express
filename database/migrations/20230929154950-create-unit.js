'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('unit', {
      name: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      attack: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      carrying_capacity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      movement_speed: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      population_cost: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      training_time: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      civilization_name: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'civilization',
          key: 'name'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      unit_type: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'unit_type',
          key: 'type'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      military_building: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'military_building',
          key: 'name'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('unit');
  }
};