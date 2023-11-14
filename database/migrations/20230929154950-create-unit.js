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
      atk: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      carrying: {
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