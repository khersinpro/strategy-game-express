'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('building', {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      type: {
        type: Sequelize.ENUM('infrastructure_building', 'military_building', 'resource_building', 'wall_building', 'special_building'),
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
    await queryInterface.dropTable('building');
  }
};