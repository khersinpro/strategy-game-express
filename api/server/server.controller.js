const NotFoundError = require('../../errors/not-found');
const serverService = require('./server.service');

class ServerController {

    /**
     * Returns all servers
     */ 
    async getAll(req, res, next) {
        try 
        {
            const servers = await serverService.getAll();
            res.status(200).send(servers);
        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Find a server by name and returns it
     * @throws {NotFoundError} if the server does not exist
     */  
    async get(req, res, next) {
        try 
        {
            const server = await serverService.getByName(req.params.name);    

            if (!server)
            {
                throw new NotFoundError(`Server with name ${req.params.name} not found`);
            }

            res.status(200).send(server);
        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Creates a new server and returns it
     */ 
    async create(req, res, next) {
        try 
        {
            const server = await serverService.create(req.body);
            res.status(201).send(server);
        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Updates a server
     */ 
    async update(req, res, next) {
        try 
        {
            const server = await serverService.update(req.params.name, req.body);
            res.status(200).send(server);
        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Deletes a server
     */ 
    async delete(req, res, next) {
        try 
        {
            const server = await serverService.delete(req.params.name);
            res.status(200).json(server);
        }
        catch (error)
        {
            next(error);
        }
    }
}

module.exports = new ServerController();