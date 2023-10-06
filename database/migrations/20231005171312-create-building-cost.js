'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('building_cost', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      resource_name: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'resource',
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
          unique_resource_level: {
            fields: ['resource_name', 'building_level_id']
          }
        }
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('building_cost');
  }
};