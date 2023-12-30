'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('support', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        allowNull: false,
        references: {
          model: 'village',
          key: 'id'
        }
      },
      arrival_date: {
        type: Sequelize.DATE
      },
      return_date: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'support_status',
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
    });

    // Add constraint to make sure that supported village id and supporting village id are not the same
    queryInterface.addConstraint('support', {
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
    await queryInterface.removeConstraint('support', 'not_same_support_village');
    await queryInterface.dropTable('support');
  }
};