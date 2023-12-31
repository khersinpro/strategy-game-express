const sequelize = require('../../database/index').sequelize; 
const VillageService = require('../village/village.service');
const EuclideanDistanceCalculator = require('../../utils/euclideanDistanceCalculator');
const BadRequestError = require('../../errors/bad-request');
const { Op } = require('sequelize');
const {
    Support,
    Supporting_unit,
    Village_unit,
    Unit
} = require('../../database/index').models;

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
            let slowestUnit = 0;

            const supportingVillage = await VillageService.getById(data.supporting_village_id);
            supportingVillage.isAdminOrVillageOwner(currentUser);

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

    /**
     * Handle the incomming supports
     * @param {number} supportedVillageId - The id of the supported village
     * @param {Date} endDate - The date to update the village, default is now 
     * @returns {Promise<void>}
     */
    async handleSupport (supportedVillageId, endDate = new Date()) {
        const transaction = await sequelize.transaction();
        try
        {
            const supports = await Support.findAll({
                where: {
                    supported_village_id: supportedVillageId,
                    status: 1,
                    arrival_date: {
                        [Op.lte]: endDate
                    }
                }
            });

            for (const support of supports)
            {
                support.status = 2;
                await support.save({ transaction });
            }

            await transaction.commit();
        }
        catch (error)
        {
            throw error;
        }
    }

    /**
     * Handle the returning supports
     * @param {number} supportingVillageId - The id of the supporting village
     * @param {Date} endDate - The date to update the village, default is now 
     * @returns {Promise<void>}
     */
    async handleReturningSupport (supportingVillageId, endDate = new Date()) {
        const transaction = await sequelize.transaction();
        try
        {
            const supports = await Support.findAll({
                where: {
                    supporting_village_id: supportingVillageId,
                    status: 4,
                    return_date: {
                        [Op.lte]: endDate
                    }
                }
            });

            for (const support of supports)
            {
                const supportingUnits = await support.getSupporting_units({
                    where: {
                        present_quantity: {
                            [Op.gt]: 0
                        }
                    }
                });

                for (const supportingUnit of supportingUnits)
                {
                    const villageUnit               = await supportingUnit.getVillage_unit();
                    villageUnit.present_quantity    += supportingUnit.present_quantity;
                    villageUnit.in_support_quantity -= supportingUnit.present_quantity;
                    await villageUnit.save({ transaction });
                }
                
                support.status = 5;
                await support.save({ transaction});
            }

            await transaction.commit();
        }
        catch (error)
        {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Cancel a support actually supporting a village or on the way to the supported village
     * @param {number} supportId - The id of the support 
     * @param {User} currentUser - The current user
     * @returns {Promise<Support>}
     */
    async cancelSupport (supportId, currentUser) {
        const transaction = await sequelize.transaction();
        try
        {
            const support = await Support.findByPk(supportId, {
                where : {
                    status: {
                        [Op.in]: [1, 2]
                    }
                }
            });
            

            if (!support)
            {
                throw new BadRequestError(`Support not found or already canceled`);
            }
            
            const supportingVillage = await support.getSupporting_village();
            const supportedVillage  = await support.getSupported_village();

            if (supportingVillage.user_id !== currentUser.id && supportedVillage.user_id !== currentUser.id && !currentUser.isAdmin())
            {
                throw new BadRequestError(`You are not allowed to cancel this support`);
            }

            // If support is on the way to the supported village, Else support is actually supporting the supported village
            if (support.status === 1) 
            {
                const createdDate   = new Date(support.createdAt);
                const arrivalDate   = new Date(support.arrival_date);
                const traveledTime  = arrivalDate.getTime() - createdDate.getTime();
                const returnDate    =  new Date(new Date().getTime() + traveledTime);
                support.return_date = returnDate;
                support.status      = 4;

                await support.save({ transaction });
            }
            else
            {
                let slowestUnit = 0;
                const supportingUnits = await support.getSupporting_units({
                    where: {
                        present_quantity: {
                            [Op.gt]: 0
                        }
                    }
                });

                for (const supportingUnit of supportingUnits)
                {
                    const villageUnit = await Village_unit.findByPk(supportingUnit.village_unit_id, {
                        attributes: ['id'],
                        include : [
                            {
                                model: Unit,
                                attributes: ['movement_speed'],
                                required: true
                            }
                        ]
                    });

                    if (!villageUnit)
                    {
                        throw new BadRequestError(`Village unit not found`);
                    }

                    const movementSpeed = villageUnit.Unit.movement_speed;
                    slowestUnit = movementSpeed > slowestUnit ? movementSpeed : slowestUnit;
                }

                const supportingVillage = await support.getSupporting_village();
                const supportedVillage  = await support.getSupported_village();

                const supportingMapPosition = await supportingVillage.getMap_position();
                const supportedMapPosition  = await supportedVillage.getMap_position();

                const { x: supportingX, y: supportingY }  = supportingMapPosition;
                const { x: supportedX,  y: supportedY }   = supportedMapPosition;

                const euclideanCalculator = new EuclideanDistanceCalculator(supportingX, supportingY, supportedX, supportedY);
                const returnDate          = euclideanCalculator.getArrivalDate(new Date(), slowestUnit);

                support.return_date = returnDate;
                support.status      = 4;

                await support.save({ transaction });           
            }

            await transaction.commit();
            return support;
        }
        catch (error)
        {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Other methods
     */


}

module.exports = new SupportService();