'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('map_position', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      x: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'unique_x_y'
      },
      y: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        unique: 'unique_x_y'
      },
      map_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'map',
          key: 'id'
        }, 
        unique: ['unique_x_y', 'unique_target']
      },
      target_entity_id: {
        type: Sequelize.INTEGER, 
        allowNull: true,
        unique: 'unique_target'
      },
      target_type: {
        type: Sequelize.ENUM('village', 'empty'),
        defaultValue: 'empty',
        allowNull: false, 
        unique: 'unique_target'
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
        unique_x_y: {
          fields: ['x', 'y', 'map_id']
        }, 
        unique_target: {
          fields: ['target_entity_id', 'target_type', 'map_id']
        }
      }
    
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('map_position');
  }
};