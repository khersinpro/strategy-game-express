'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('storage_capacity', {
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      storage_building_name: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'storage_building',
          key: 'name'
        }
      },
      building_level_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'building_level',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      uniqueKeys: {
        unique_storage_capacity: {
          fields: ['storage_building_name', 'building_level_id']
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('storage_capacity');
  }
};