'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('unit', 'civilization_type', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'civilization',
        key: 'type'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addColumn('unit', 'unit_type', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'unit_type',
        key: 'type'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addColumn('unit', 'military_building', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'military_building',
        key: 'name'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
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
