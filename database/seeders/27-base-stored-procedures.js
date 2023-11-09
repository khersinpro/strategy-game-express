'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE get_all_village_resources()
      BEGIN
        SELECT 
          v1.building_name,
          v1.id AS village_building_id,
          resource_production.production,
          v1.village_id,
          resource_building.resource_name,
          village_resource.id AS village_resource_id,
          village_resource.quantity AS village_resource_quantity,
          village_resource.updatedAt AS village_last_update,
          storage_capacity.capacity
        FROM 
          village_building v1
        LEFT JOIN 
          resource_building ON v1.building_name = resource_building.name
        LEFT JOIN 
          resource_production ON v1.building_level_id = resource_production.building_level_id
        LEFT JOIN 
          village_resource ON resource_building.resource_name = village_resource.resource_name
        LEFT JOIN 
          storage_building ON village_resource.resource_name = storage_building.resource_name
        LEFT JOIN 
        village_building AS v2 ON v1.village_id = v2.village_id AND storage_building.name = v2.building_name
        LEFT JOIN 
          storage_capacity ON v2.building_level_id = storage_capacity.building_level_id
        WHERE 
          v1.type = 'resource_building'
          AND v1.village_id = village_resource.village_id
        ORDER BY village_resource_id ASC;
      END;
    `);

    await queryInterface.sequelize.query(`
      CREATE PROCEDURE get_all_village_resources_by_village_id(IN villageId INT)
      BEGIN
        SELECT 
          v1.building_name,
          v1.id AS village_building_id,
          resource_production.production,
          v1.village_id,
          resource_building.resource_name,
          village_resource.id AS village_resource_id,
          village_resource.quantity AS village_resource_quantity,
          village_resource.updatedAt AS village_last_update,
          storage_capacity.capacity
        FROM 
          village_building v1
        LEFT JOIN 
          resource_building ON v1.building_name = resource_building.name
        LEFT JOIN 
          resource_production ON v1.building_level_id = resource_production.building_level_id
        LEFT JOIN 
          village_resource ON resource_building.resource_name = village_resource.resource_name
        LEFT JOIN 
          storage_building ON village_resource.resource_name = storage_building.resource_name
        LEFT JOIN 
          village_building AS v2 ON v1.village_id = v2.village_id AND storage_building.name = v2.building_name AND v2.type = 'storage_building'
        LEFT JOIN 
          storage_capacity ON v2.building_level_id = storage_capacity.building_level_id
        WHERE 
            v1.type = 'resource_building'
            AND v1.village_id = villageId
            AND village_resource.village_id = villageId;
      END;
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP PROCEDURE get_all_village_resources;
    `);
    await queryInterface.sequelize.query(`
      DROP PROCEDURE get_all_village_resources_by_village_id;
    `);
  }
};
