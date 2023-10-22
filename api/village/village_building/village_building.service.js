const NotFoundError = require('../../../errors/not-found');
const { Village_building } = require('../../../database/index').models;
class VillageBuildingService {

    /**
     * Returns buildings of all villages
     * @returns {Promise<Village_building>}
     */
    getAll() {
        return Village_building.findAll();
    }

    /**
     * Returns buildings of a village
     * @param {Number} id village building id 
     * @throws {NotFoundError} when village building not found
     * @returns {Promise<Village_building>}
     */ 
    async getById(id) {
        const villageBuilding = await Village_building.findByPk(id);

        if (!villageBuilding)
        {
            throw new NotFoundError('Village building not found')
        }

        return villageBuilding;
    }

    /**
     * Return created village building promise
     * @param {Object} data village data
     * @returns {Promise<Village_building>}
     */ 
    create(data) {
        return Village_building.create(data);
    }

    /**
     * Return updated village building promise
     * @param {Number} id village building id
     * @param {Object} data village building data
     * @return {Promise<Village_building>}
     */
    update(id, data) {
        return Village_building.update(data, {
            where: {
                id: id
            }
        });
    }

    /**
     * Return deleted village building promise
     * @param {Number} id village building id
     * @throws {NotFoundError} when village building not found
     * @returns {Promise<Village_building>}
     */ 
    async delete(id) {
        const villageBuilding = await this.getById(id);

        if (!villageBuilding)
        {
            throw new NotFoundError('Village building not found')
        }

        return village.destroy();
    }
}

module.exports = new VillageBuildingService();