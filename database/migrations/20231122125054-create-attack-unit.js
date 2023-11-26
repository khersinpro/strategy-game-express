'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attack_unit', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      attack_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'attack',
          key: 'id'
        }
      },
      village_unit_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'village_unit',
          key: 'id'
        }
      },
      sent_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      lost_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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
        unique_attack_unit: {
          fields: ['attack_id', 'village_unit_id']
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('attack_unit');
  }
};