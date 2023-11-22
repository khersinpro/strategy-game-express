'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attack', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      attacked_village_id: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: {
          model: 'village',
          key: 'id'
        }
      },
      attacking_village_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'village',
          key: 'id'
        }
      },
      departure_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      arrival_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      return_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      attacker_report: {
        type: Sequelize.BOOLEAN,
        allowNull: false, 
        defaultValue: true
      },
      attacked_report: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      attack_status: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'attack_status',
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
        unique_attack: {
          fields: ['attacked_village_id', 'attacking_village_id', 'departure_date']
        }
      }
    });

    // Add constraint to make sure that attacked_village_id and attacking_village_id are not the same
    queryInterface.addConstraint('attack', {
      fields: ['attacked_village_id', 'attacking_village_id'],
      type: 'check',
      name: 'not_same_village',
      where: {
        attacked_village_id: {
          [Sequelize.Op.ne]: Sequelize.col('attacking_village_id')
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('attack', 'not_same_village');
    await queryInterface.dropTable('attack');
  }
};