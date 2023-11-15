'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('unit_cost', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      unit_name: {
        type: Sequelize.STRING,
        references: {
          model: 'unit',
          key: 'name'
        },
        unique: 'unique_unit_cost'
      },
      resource_name: {
        type: Sequelize.STRING,
        references: {
          model: 'resource',
          key: 'name'
        },
        unique: 'unique_unit_cost'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
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
            unique_unit_cost: {
                fields: ['unit_name', 'resource_name']
            }
        }
    
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('unit_cost');
  }
};