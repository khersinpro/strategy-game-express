const VillageTrainingProgressService = require('../village_training_progress/village_training_progress.service');
const VillageUnitService = require('../village_unit/village_unit.service');

class VillageTrainingProgressController {
    async getAll (req, res, next) {
        try
        {
            const village_training_progress = await VillageTrainingProgressService.getAll();

            return res.status(200).json(village_training_progress);
        }
        catch (error)
        {
            return next(error);
        }
    }

    async getById (req, res, next) {
        try
        {
            const village_training_progress = await VillageTrainingProgressService.getById(req.params.id);

            return res.status(200).json(village_training_progress);
        }
        catch (error)
        {
            return next(error);
        }
    }

    async create (req, res, next) {
        try
        {
            const village_training_progress = await VillageTrainingProgressService.create(req.body, req.user);

            return res.status(201).json(village_training_progress);
        }
        catch (error)
        {
            return next(error);
        }
    }

    async update (req, res, next) {
        try
        {
            const village_training_progress = await VillageTrainingProgressService.update(req.params.id, req.body);

            return res.status(200).json(village_training_progress);
        }
        catch (error)
        {
            return next(error);
        }
    }

    async delete (req, res, next) {
        try
        {
            await VillageTrainingProgressService.delete(req.params.id);
            return res.status(204).end();
        }
        catch (error)
        {
            return next(error);
        }
    }

    /**
     * Cancel a training
     * @param {Number} req.params.id - village_training_progress id
     * @param {Number} req.params.village_id - village id
     */
    async cancelTraining (req, res, next) {
        try 
        {
            await VillageTrainingProgressService.cancelTrainingProgress(req.params.id, req.user);
            res.status(204).end();
        }
        catch (error)
        {
            return next(error);
        }   
    }
}

module.exports = new VillageTrainingProgressController();