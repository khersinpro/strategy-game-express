'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resource_production', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      production: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      resource_building_name: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'resource_building',
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
        unique_resource_production_level: {
          fields: ['resource_building_name', 'building_level_id']
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('resource_production');
  }
};