'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('village', 'civilization_type', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'civilization',
        key: 'type'
        }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('village', 'civilization_type')
  }
};
