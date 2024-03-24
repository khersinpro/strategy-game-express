const { Op }                    = require('sequelize');
const NotFoundError             = require('../../../errors/not-found');
const { sequelize }             = require('../../../database/index');
const Village_unit              = require('../../../database/models/village_unit');
const Village_training_progress = require('../../../database/models/village_training_progress');

class VillageUnitService {
    /**
     * Returns unit of all villages
     * @returns {Promise<Village_unit>}
     */
    getAll() {
        return Village_unit.findAll();
    }

    /**
     * Returns unit of a village by id
     * @param {Number} id village village id
     * @throws {NotFoundError} when village village not found
     * @returns {Promise<Village_unit>}
     */ 
    async getById(id) {

        const villageUnit = await Village_unit.findByPk(id);

        if (!villageUnit)
        {
            throw new NotFoundError('Village unit not found')
        }

        return villageUnit;
    }

    /**
     * Return created village village promise
     * @param {Object} data village data
     * @returns {Promise<Village_unit>}
     */ 
    create(data) {
        return Village_unit.create(data);
    }

    /**
     * Return updated village village promise
     * @param {Number} id village village id
     * @param {Object} data village village data
     * @return {Promise<Village_unit>}
     */
    update(id, data) {
        return Village_unit.update(data, {
            where: {
                id: id
            }
        });
    }

    /**
     * Return deleted village village promise
     * @param {Number} id village village id
     * @throws {NotFoundError} when village village not found
     * @returns {Promise<Village_unit>}
     */ 
    async delete(id) {
        const villageUnit = await this.getById(id);

        if (!villageUnit)
        {
            throw new NotFoundError('Village not found')
        }

        return villageUnit.destroy();
    }

    /**
     * Create the village unit who training is finished and update the village training progress
     * If village id is passed, create the village unit for the village id passed else create for all village
     * @param {Number} villageId - The village id
     * @param {Date} updateEndDate - the limit date to update the village training progress
     * @returns {Promise<Sequelize.Transaction>}
     */ 
    async addUnitAfterTraining (villageId, updateEndDate = new Date()) {
        const transacton = await sequelize.transaction();
        try
        {
            const whereParams = {
                training_start: {
                    [Op.lt]: updateEndDate
                },
                enabled: true,
                archived: false
            };

            if (villageId)
            {
                whereParams.village_id = villageId;
            }

            // get village training progress for the village where training start < now and enabled is true and archived is false
            const villageTrainingProgresses = await Village_training_progress.findAll({ where: whereParams });

            for (const villageTrainingProgress of villageTrainingProgresses)
            {
                // calculate the number of unit to create since training start and date now / single_training_duration as total
                const totalUnitCreated = villageTrainingProgress.getTotalsUnitsTrained(updateEndDate);
                
                if (totalUnitCreated === 0)
                {
                    continue;
                }
       
                // calculate the total number of unit trained - trained_unit_count to get the number of unit to create as trained unit
                const unitToCreate = villageTrainingProgress.getUnitCountTrainedSinceLastUpdate(updateEndDate);

                // get the village unit to update
                const villageUnit = await this.getById(villageTrainingProgress.village_unit_id);

                // Create the unit in the village
                villageUnit.total_quantity += unitToCreate;
                villageUnit.present_quantity += unitToCreate;
                villageUnit.updatedAt = updateEndDate;
                villageUnit.save({ transaction: transacton});

                // Check if the total unit created is less than the unit to train in village_training_progress then update the trained_unit_count
                if (unitToCreate + villageTrainingProgress.trained_unit_count < villageTrainingProgress.unit_to_train_count)
                {
                    await villageTrainingProgress.update({
                        trained_unit_count: totalUnitCreated,
                        updatedAt: updateEndDate
                    }, {
                        transaction: transacton
                    });
                }
                // Check if the total unit created is equal to the unit to train in village_training_progress then update the trained_unit_count and enabled to false
                else if (unitToCreate + villageTrainingProgress.trained_unit_count === villageTrainingProgress.unit_to_train_count)
                {
                    // update the trained_unit_count
                    await villageTrainingProgress.update({
                        trained_unit_count: totalUnitCreated,
                        updatedAt: updateEndDate,
                        enabled: false,
                        archived: true
                    }, {
                        transaction: transacton
                    });
                }
                // Check if the total unit created is greater than the unit to train in village_training_progress then throw an error
                else 
                {
                    throw new Error('Total units trained is greater than the unit to train in village_unit.service');
                }
            }

            return transacton.commit();
        }
        catch (error)
        {
            transacton.rollback();
            throw error;
        }
    }
}

module.exports = new VillageUnitService();