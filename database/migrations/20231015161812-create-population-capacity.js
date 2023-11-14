'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('population_capacity', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      town_all_building_name: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'town_all_building',
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
        unique_population_capacity: {
          fields: ['town_all_building_name', 'building_level_id']
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('population_capacity');
  }
};