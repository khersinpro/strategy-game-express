'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('village_support', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      supported_village_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'village',
          key: 'id'
        }
      },
      supporting_village_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'village',
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
      enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add constraint to make sure that supported village id and supporting village id are not the same
    queryInterface.addConstraint('village_support', {
      fields: ['supported_village_id', 'supporting_village_id'],
      type: 'check',
      name: 'not_same_support_village',
      where: {
        supported_village_id: {
          [Sequelize.Op.ne]: Sequelize.col('supporting_village_id')
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('village_support', 'not_same_support_village');
    await queryInterface.dropTable('village_support');
  }
};