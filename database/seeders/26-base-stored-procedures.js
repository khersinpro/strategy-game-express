'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE get_all_village_resources()
      BEGIN
        SELECT 
          v1.building_name,
          v1.id AS production_village_building_id,
          resource_production.production,
          v1.village_id,
          resource_building.resource_name,
          village_resource.id AS village_resource_id,
          village_resource.quantity AS village_resource_quantity,
          village_resource.updatedAt AS village_last_update,
          v2.id AS storage_village_building_id,
          storage_capacity.capacity AS village_resource_storage
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
          v1.id AS production_village_building_id,
          resource_production.production,
          v1.village_id,
          resource_building.resource_name,
          village_resource.id AS village_resource_id,
          village_resource.quantity AS village_resource_quantity,
          village_resource.updatedAt AS village_last_update,
          v2.id AS storage_village_building_id,
          storage_capacity.capacity AS village_resource_storage
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

    await queryInterface.sequelize.query(`
      CREATE PROCEDURE get_village_buildings_update_by_id(IN villageId INT, IN startDate DATETIME, IN endDate DATETIME)
      BEGIN
        SELECT * FROM (
          SELECT 
            village_building.id AS village_building_id,
            village_building.type AS building_type,
            resource_production.production AS resource_production,
            village_construction_progress.id AS construction_progress_id,
            village_construction_progress.construction_end AS construction_end,
            village_update_construction.building_level_id AS building_level_id,
            NULL AS storage_capacity
          FROM village_construction_progress 
          INNER JOIN village_update_construction ON village_construction_progress.id = village_update_construction.id
          INNER JOIN village_building ON village_update_construction.village_building_id = village_building.id
          INNER JOIN resource_production ON village_update_construction.building_level_id = resource_production.building_level_id
          WHERE 
            village_construction_progress.village_id = villageId
            AND village_construction_progress.enabled = 1
            AND village_construction_progress.archived = 0
            AND village_construction_progress.construction_end BETWEEN startDate AND endDate
          UNION
          SELECT 
            village_building.id AS village_building_id,
            village_building.type AS building_type,
            NULL AS resource_production,
            village_construction_progress.id AS construction_progress_id,
            village_construction_progress.construction_end AS construction_end,
            village_update_construction.building_level_id AS building_level_id,
            storage_capacity.capacity AS storage_capacity
          FROM village_construction_progress 
          INNER JOIN village_update_construction ON village_construction_progress.id = village_update_construction.id
          INNER JOIN village_building ON village_update_construction.village_building_id = village_building.id
          INNER JOIN storage_capacity ON village_update_construction.building_level_id = storage_capacity.building_level_id
          WHERE 
            village_construction_progress.village_id = villageId
            AND village_construction_progress.enabled = 1
            AND village_construction_progress.archived = 0
            AND village_construction_progress.construction_end BETWEEN startDate AND endDate
        ) AS village_buildings_update ORDER BY construction_end ASC;
      END 
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP PROCEDURE get_all_village_resources;
    `);
    await queryInterface.sequelize.query(`
      DROP PROCEDURE get_all_village_resources_by_village_id;
    `);
    await queryInterface.sequelize.query(`
      DROP PROCEDURE get_village_buildings_update_by_id;
    `);
  }
};
