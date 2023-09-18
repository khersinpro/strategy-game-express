'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('village', 'server_name', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'server',
        key: 'name'
        }
      })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('village', 'server_name')
  }
};
