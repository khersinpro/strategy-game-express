'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('user', 'role_name', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'ROLE_USER',
      references: {
        model: 'role',
        key: 'name'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('user', 'role_name')
  }
};
