'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('supporting_unit', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      support_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'support',
          key: 'id'
        }
      },
      village_unit_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'village_unit',
          key: 'id'
        }
      },
      sent_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      present_quantity: {
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
    await queryInterface.dropTable('supporting_unit');
  }
};