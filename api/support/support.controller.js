const SupportService = require('./support.service');

class SupportController {
    /**
     * Get all supports
     */
    async getAll (req, res, next) {
        try
        {
            const supports = await SupportService.getAll();
            res.status(200).json(supports);
        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Get support by id
     */
    async get (req, res, next) {
        try
        {
            const support = await SupportService.get(req.params.id);
            res.status(200).json(support);
        }
        catch (error)
        {
            next(error);
        }
    }

    async create (req, res, next) {
        try
        {
            const support = await SupportService.create(req.body, req.user);
            res.status(201).json(support);
        }
        catch (error)
        {
            next(error);
        }
    }

    async cancelSupport (req, res, next) {
        try
        {
            const support = await SupportService.cancelSupport(req.params.id, req.user);
            res.status(200).json(support);
        }
        catch (error)
        {
            next(error);
        }
    }
}

module.exports = new SupportController();