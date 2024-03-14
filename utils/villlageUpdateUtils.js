const AttackService = require('../api/attack/attack.service');                 
const VillageBuildingService = require('../api/village/village_building/village_building.service');
const VillageResourceService = require('../api/village/village_resource/village_resource.service');
const VillageUnitService = require('../api/village/village_unit/village_unit.service')
const SupportService = require('../api/support/support.service');

class villageUpdateUtils {
    /**
     * Static method to update all of the village
     * @param {number} villageId - The village id
     * @param {Date} updateDate - The date of the update (default: new Date())
     * @returns {Promise<void>}
     */
    static async updateVillageData(villageId, updateDate = new Date()) {
        try
        {
            // Update the village incoming attacks
            await AttackService.handleIncommingAttacks(villageId, updateDate);

            // Update the village resources production
            await VillageResourceService.updateVillageResource(villageId, updateDate);

            // Update the village building construction progress
            await VillageBuildingService.createUniqueVillageBuildingWhenConstructionProgressIsFinished(villageId, updateDate);
            await VillageBuildingService.updateUniqueVillageBuildingWhenConstructionProgressIsFinished(villageId, updateDate);

            // Update the village unit training progress
            await VillageUnitService.addUnitAfterTraining(villageId, updateDate);

            // Update the village unit movement (attack and support)
            await AttackService.handleReturningAttacks(villageId, updateDate);
            await SupportService.handleSupport(villageId, updateDate);
            await SupportService.handleReturningSupport(villageId, updateDate);
        }
        catch (error)
        {
            throw error;
        }
    }
}

module.exports = villageUpdateUtils;