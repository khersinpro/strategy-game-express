'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('village_building', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      village_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
          model: 'village',
          key: 'id'
        }
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'building_type',
          key: 'name'
        }
      },
      building_name: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'building',
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
        unique_village_building: {
          fields: ['village_id', 'building_name']
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('village_building');
  }
};