const SupportStatusService = require('./support_status.service');

class SupportStatusController {
    /**
     * Get all Support_status
     */
    async getAll (req, res, next) {
        try
        {
            const supportStatus = await SupportStatusService.getAll();
            res.status(200).json(supportStatus);
        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Get Support_status by id
     */
    async get (req, res, next) {
        try
        {
            const supportStatus = await SupportStatusService.getById(req.params.id);
            res.status(200).json(supportStatus);
        }
        catch (error)
        {
            next(error);
        }
    }

    async create (req, res, next) {
        try
        {
            const supportStatus = await SupportStatusService.create(req.body);
            res.status(201).json(supportStatus);
        }
        catch (error)
        {
            next(error);
        }
    }

    async update (req, res, next) {
        try
        {
            const supportStatus = await SupportStatusService.update(req.params.id, req.body);
            res.status(200).json(supportStatus);
        }
        catch (error)
        {
            next(error);
        }
    }

    async delete (req, res, next) {
        try
        {
            const supportStatus = await SupportStatusService.delete(req.params.id);
            res.status(200).json(supportStatus);
        }
        catch (error)
        {
            next(error);
        }
    }
}

module.exports = new SupportStatusController();