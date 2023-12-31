const {
    Support,
    Supporting_unit,
    Village,
    Village_unit,
} = require('../../database/index').models;
const sequelize = require('../../database/index').sequelize;
const village = require('../../database/models/village');
const VillageService = require('../village/village.service');
const EuclideanDistanceCalculator = require('../../utils/euclideanDistanceCalculator');
const BadRequestError = require('../../errors/bad-request');

class SupportService {

    /**
     * get one support by id
     * @param {number} id - The id of the support
     * @returns {Promise<Support>} - The support promise
     */
    get (id) {
        return Support.findByPk(id);
    }

    /**
     * get all supports
     * @returns {Promise<Support[]>} - The support promise
     */ 
    getAll () {
        return Support.findAll();
    }

    /**
     * create a new support
     * @param {Object} data - The data of the support
     * @param {number} data.supporting_village_id - The id of the supporting village
     * @param {number} data.supported_village_id - The id of the supported village
     * @param {Object[]} data.supporting_units - The supporting units
     * @param {number} data.supporting_units[].village_unit_id - The id of the village unit
     * @param {number} data.supporting_units[].sent_quantity - The sent quantity of the village unit
     * @param {User} currentUser - The current user
     * @returns {Promise<Support>} - The support promise
     */
    async create (data, currentUser) {
        const transaction = await sequelize.transaction();
        try
        {
            console.log(data);
            let slowestUnit = 0;
            console.log('arrivé ici');
            const supportingVillage = await VillageService.getById(data.supporting_village_id);
            console.log('arrivé la');
            supportingVillage.isAdminOrVillageOwner(currentUser);
            console.log('bug',supportingVillage);
            const supportedVillage = await VillageService.getById(data.supported_village_id);

            const support = await Support.create({
                supporting_village_id: supportingVillage.id,
                supported_village_id: supportedVillage.id,
                status: 6
            });

            for (const supportingUnit of data.supporting_units)
            {
                const villageUnit  = await Village_unit.findByPk(supportingUnit.village_unit_id, {
                    where: {
                        village_id: supportingVillage.id
                    }
                });

                if (!villageUnit)
                {
                    throw new BadRequestError(`Village unit not found`);
                }

                const sentQuantity = supportingUnit.sent_quantity;

                if (villageUnit.present_quantity < sentQuantity)
                {
                    throw new BadRequestError(`Not enough units in the village`);
                }

                const unit = await villageUnit.getUnit();

                if (unit.movement_speed > slowestUnit)
                {
                    slowestUnit = unit.movement_speed;
                }

                villageUnit.present_quantity    -= sentQuantity;
                villageUnit.in_support_quantity += sentQuantity;
                await villageUnit.save({ transaction });


                await Supporting_unit.create({
                    support_id: support.id,
                    village_unit_id: supportingUnit.village_unit_id,
                    sent_quantity: sentQuantity,
                    present_quantity: sentQuantity
                }, { transaction });
            }

            const supportingMapPosition = await supportingVillage.getMap_position();
            const supportedMapPosition  = await supportedVillage.getMap_position();

            const { x: supportingX, y: supportingY } = supportingMapPosition;
            const { x: supportedX, y: supportedY }   = supportedMapPosition;

            const euclideanCalculator = new EuclideanDistanceCalculator(supportingX, supportingY, supportedX, supportedY);
            const arrivalDate = euclideanCalculator.getArrivalDate(new Date(), slowestUnit);

            support.arrival_date = arrivalDate;
            support.status = 1;
            await support.save({ transaction });

            await transaction.commit();

            return support;
        }
        catch (error)
        {
            console.error(error);
            await transaction.rollback(); 
            throw error;
        }
    }

    async handleSupport (supportedVillageId) {
        try
        {

        }
        catch (error)
        {
            throw error;
        }
    }

    async handleReturningSupport (supportingVillageId) {
        try
        {

        }
        catch (error)
        {
            throw error;
        }
    }

    async cancelSupport (supportId) {
        try
        {

        }
        catch (error)
        {
            throw error;
        }
    }

    /**
     * Other methods
     */


}

module.exports = new SupportService();