'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('defense_type', {
      unit_name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'unit',
          key: 'name'
        }
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'unit_type',
          key: 'type'
        }
      },
      defense_value: {
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
    await queryInterface.dropTable('defense_type');
  }
};