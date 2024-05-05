'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('resource_building', 'resource_name', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      references: {
        model: 'resource', 
        key: 'name'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
