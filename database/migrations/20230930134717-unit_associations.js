'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('unit', 'civilization_name', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'civilization',
        key: 'name'
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
    await queryInterface.removeColumn('unit', 'civilization_name');
    await queryInterface.removeColumn('unit', 'unit_type');
    await queryInterface.removeColumn('unit', 'military_building');
  }
};
