'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('storage_building', {
      name: {
        type: Sequelize.STRING, 
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'building',
          key: 'name'
        }
      },
      resource_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        references: {
          model: 'resource',
          key: 'name'
        }
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
    await queryInterface.dropTable('storage_building');
  }
};