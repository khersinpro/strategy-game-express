'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('village_resource', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      village_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'village',
            key: 'id'
          }
      },
      resource_name: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'resource',
          key: 'name'
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
        unique_village_resource: {
          fields: ['village_id', 'resource_name']
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('village_resource');
  }
};