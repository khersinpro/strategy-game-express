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
        type: Sequelize.STRING,
        references: {
          model: 'building_type',
          key: 'name'
        },
        allowNull: false
      },
      is_common: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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