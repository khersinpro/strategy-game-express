const NotFoundError = require('../../../errors/not-found');
const Wall_defense  = require('../../../database/models/wall_defense');
const Building_level = require('../../../database/models/building_level');

class WallDefenseService {
    /**
     * return all wall defenses into promise
     * @returns {Promise<Wall_defense[]>}
     */
    getAll() {
        return Wall_defense.findAll();
    }

    /**
     * Return all wall defenses with included building level by building name
     * 
     * @param {string} name - The name of the building
     * @returns {Promise<Wall_defense[]>}
     */ 
    getAllWithLevelByBuildingName(name) {
        return Wall_defense.findAll({
            where: { wall_building_name: name },
            include: {
                model: Building_level,
                as: 'building_level'
            },
            order: [
                ['building_level', 'level', 'ASC']
            ]
        })
    }

    /**
     * return a defense by id into promise
     * @param {Number} id
     * @throws {NotFoundError} When the defense is not found
     * @returns {Promise<Wall_defense>}
     */
    async getById(id) {
       const wallBuilding = await Wall_defense.findByPk(id);
       
        if (!wallBuilding) {
            throw new NotFoundError('Wall_defense not found');
        }

        return wallBuilding;
    }

    /**
     * Create a defense
     * @param {Object} data
     * @returns {Promise<Wall_defense>}
     */
    create(data) {
        return Wall_defense.create(data);
    }

    /**
     * Update a defense
     * @param {Number} id
     * @param {Object} data
     * @returns {Promise<Wall_defense>}
     */
    update(id, data) {
        return Wall_defense.update(data, {
            where: {
                id
            }
        });
    }

    /**
     * Delete a defense
     * @param {Number} id
     * @throws {NotFoundError} When the defense is not found
     * @returns {Promise<Wall_defense>}
     */
    async delete(id) {
        const wallBuilding = await this.getById(id);

        if (!wallBuilding) {
            throw new NotFoundError('Wall_defense not found');
        }

        return wallBuilding.destroy();
    }
}

module.exports = new WallDefenseService();