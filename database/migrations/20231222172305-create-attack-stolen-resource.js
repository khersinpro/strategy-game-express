'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attack_stolen_resource', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      resource_type: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'resource',
          key: 'name'
        }
      },
      attack_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'attack',
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
      indexes: [
        {
          unique: true,
          fields: ['attack_id', 'resource_type']
        }
      ]
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('attack_stolen_resource');
  }
};