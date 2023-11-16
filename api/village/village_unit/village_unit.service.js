const { Op } = require('sequelize');
const NotFoundError = require('../../../errors/not-found');
const { sequelize } = require('../../../database/index');
const village = require('../../../database/models/village');
const { Village_unit, Village_training_progress } = require('../../../database/index').models;
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
            throw new NotFoundError('Village nit not found')
        }

        return villageUnit.destroy();
    }

    /**
     * Create the village unit who training is finished
     * @param {Number} villageId village id
     * @returns {Promise<Sequelize.Transaction>}
     */ 
    async addUnitAfterTraining (villageId) {
        const transacton = await sequelize.transaction();
        try
        {
            // get village training progress for the village where training start < now and enabled is true and archived is false
            const villageTrainingProgresses = await Village_training_progress.findAll({
                where: {
                    village_id: villageId,
                    training_start: {
                        [Op.lt]: new Date()
                    },
                    enabled: true,
                    archived: false
                }
            });

            for (const villageTrainingProgress of villageTrainingProgresses)
            {
                // calculate the number of unit to create since training start and date now / single_training_duration as total
                const startDate                     = new Date(villageTrainingProgress.training_start);
                const endDate                       = villageTrainingProgress.training_end >= new Date() ? new Date() : new Date(villageTrainingProgress.training_end);
                const diffInSec                     = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
                const singleUnitTrainingDuration    = villageTrainingProgress.single_training_duration;
                const totalUnitCreated              = Math.floor(diffInSec / singleUnitTrainingDuration);
                
                if (totalUnitCreated === 0)
                {
                    continue;
                }
       
                // calculate the total number of unit trained - trained_unit_count to get the number of unit to create as trained unit
                const trainedUnit                   = villageTrainingProgress.trained_unit_count;
                const unitToCreate                  = totalUnitCreated - trainedUnit;

                // get the village unit to update
                const villageUnit                   = await this.getById(villageTrainingProgress.village_unit_id);

                console.log('trained', trainedUnit);
                console.log('units', unitToCreate);
                // check if the trained unit is less than the total unit to create if yes create the unit, if equal set enabled to false archieved to true
                if (unitToCreate + trainedUnit < villageTrainingProgress.unit_to_train_count)
                {
                    // increment the unit
                    villageUnit.quantity += unitToCreate;
                    villageUnit.save({ transaction: transacton});

                    // update the trained_unit_count
                    await villageTrainingProgress.update({
                        trained_unit_count: totalUnitCreated
                    }, {
                        transaction: transacton
                    });
                }
                else if (unitToCreate + trainedUnit === villageTrainingProgress.unit_to_train_count)
                {
                    // increment the unit
                    villageUnit.quantity += unitToCreate;
                    villageUnit.save({ transaction: transacton});

                    // update the trained_unit_count
                    await villageTrainingProgress.update({
                        trained_unit_count: totalUnitCreated,
                        enabled: false,
                        archived: true
                    }, {
                        transaction: transacton
                    });
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

    async addUnitAfterTrainingToAllVillages () {
        try
        {

        }
        catch (error)
        {
            throw error;
        }
    }
}

module.exports = new VillageUnitService();