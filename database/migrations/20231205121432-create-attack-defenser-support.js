'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attack_defenser_support', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sent_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      lost_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      attack_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'attack',
          key: 'id'
        }
      },
      village_support_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'village_support',
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
        unique_attack_defenser_support: {
          fields: ['attack_id', 'village_support_id']
        }
      }
    
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('attack_defenser_support');
  }
};