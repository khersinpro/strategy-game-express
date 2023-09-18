'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('village', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
        }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('village', 'user_id')
  }
};
