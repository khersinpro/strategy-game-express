const NotFoundError = require('../../../errors/not-found');
const sequelize = require('../../../database/index').sequelize;
const VillageService = require('../village.service');
const { 
    Village_training_progress, 
    Unit, 
    Unit_type, 
    Village_building, 
    Village_unit,
    Village_resource,
    Military_building, 
    Building_level,
    Unit_production,
} = require('../../../database/index').models;

class VillageTrainingProgressService {
    /**
     * Return all village training progress into promise
     * @returns {Promise<Array<Village_training_progress>>}
     */
    getAll() {
        return Village_training_progress.findAll();
    }

    /**
     * Return a village training progress by id
     * @param id - Id of the village training progress
     * @returns {VillageTrainingProgressService}
     */ 
    async getById(id) {
        try
        {
            const village_training_progress = Village_training_progress.findByPk(id);

            if (!village_training_progress)
            {
                throw new NotFoundError('Village training progress not found');
            }

            return village_training_progress;
        }
        catch (error)
        {
            throw error;
        }
    }

    /**
     * 
     * @param {Object} data - Data of the village training progress to create
     * @param {Number} data.village_id - Id of the village
     * @param {String} data.unit_name - name of the unit
     * @param {Number} data.unit_to_train - number of unit to train
     * @param {User} currentUser - Current user
     */
    async create(data, currentUser) {
        const transaction = await sequelize.transaction();
        try
        {
            // check if the village exists, if not throw NotFoundError
            const village = await VillageService.getById(data.village_id, { user: 1})
    
            // check if current user has the ownership of the village or if he is an admin, if not throw ForbiddenError
            village.isAdminOrVillageOwner(currentUser);

            // check if the unit exist and if the village has the building required to train the unit, if not throw BadRequestError

            // check if the village_building is not under construction, if not throw BadRequestError

            // check if the village has the village_unit table entry for the unit, if not create one
            
            // check if the village has enough resources to train the unit, if not throw BadRequestError

            // check if the village has enough population to train the unit, if not throw BadRequestError

            // create the village_training_progress entry

            // update the village resources



        }
        catch (error)
        {
            await transaction.rollback();
            throw error;
        }
    }

    update(id, data) {

    }

    delete(id) {

    }
}

module.exports = new VillageTrainingProgressService();