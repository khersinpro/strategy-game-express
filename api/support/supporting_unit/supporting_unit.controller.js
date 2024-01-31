const SupportingUnitService = require('./supporting_unit.service');

class SupportingUnitController {
    /**
     * Return all supporting units
     */
    async getAllSupportingUnits(req, res, next) {
        try
        {
            const supportingUnits = await SupportingUnitService.getAllSupportingUnits();

            res.status(200).json(supportingUnits);
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * Return supporting unit by id
     * @param {number} req.params.id - The id of the supporting unit
     */
    async getSupportingUnitById(req, res, next) {
        try
        {
            const supportingUnit = await SupportingUnitService.getSupportingUnitById(req.params.id);

            res.status(200).json(supportingUnit);
        }
        catch (error)
        {
            next(error);
        } 
    }

    /**
     * Create supporting unit
     * @param {object} req.body.data - The supporting unit data
     * @param {number} req.body.support_id - The id of the support
     * @param {number} req.body.village_unit_id - The id of the village unit
     * @param {number} req.body.sent_quantity - The sended quantity of the supporting unit 
     * @param {number} req.body.present_quantity - The present quantity of the supporting unit
     */
    async createSupportingUnit(req, res, next) {
        try
        {
            const supportingUnit = await SupportingUnitService.createSupportingUnit(req.body);

            res.status(201).json(supportingUnit);
        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Update supporting unit by id
     * @param {number} req.params.id - The id of the supporting unit
     * @param {object} req.body.data - The supporting unit data
     * @param {number} req.body.support_id - The id of the support
     * @param {number} req.body.village_unit_id - The id of the village unit
     * @param {number} req.body.sent_quantity - The sended quantity of the supporting unit 
     * @param {number} req.body.present_quantity - The present quantity of the supporting unit
     */
    async updateSupportingUnitById(req, res, next) {
        try
        {
            const supportingUnit = await SupportingUnitService.updateSupportingUnitById(req.params.id, req.body);

            res.status(200).json(supportingUnit);
        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Delete supporting unit by id
     * @param {number} req.params.id - The id of the supporting unit
     */
    async deleteSupportingUnitById(req, res, next) {
        try
        {
            const supportingUnit = await SupportingUnitService.deleteSupportingUnitById(req.params.id);

            res.status(200).json(supportingUnit);
        }
        catch (error)
        {
            next(error);
        }
    }
}

module.exports = new SupportingUnitController();