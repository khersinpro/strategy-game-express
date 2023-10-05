'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('village', 'civilization_name', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'civilization',
        key: 'name'
        }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('village', 'civilization_name')
  }
};
