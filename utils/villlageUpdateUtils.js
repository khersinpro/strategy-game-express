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
            await AttackService.handleIncommingAttacks(villageId, updateDate);
            await VillageResourceService.updateVillageResource(villageId, updateDate);
            await VillageBuildingService.createUniqueVillageBuildingWhenConstructionProgressIsFinished(villageId, updateDate);
            await VillageBuildingService.updateUniqueVillageBuildingWhenConstructionProgressIsFinished(villageId, updateDate);
            await VillageUnitService.addUnitAfterTraining(villageId, updateDate);
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