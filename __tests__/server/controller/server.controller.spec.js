const request   = require('supertest');
const { app }   = require('../../../server');
const jwt       = require('jsonwebtoken');
const config    = require('../../../config');
const { User, Server }  = require('../../../database/index').models;

describe('Test the server controller', () => {
    let token;
    const mockId = 1;
    const mockCurrentUser =  {
        id: 1,
        username: 'test',
        email: 'test@test.fr',
        role_name: 'ROLE_ADMIN'
    }
    const mockServer = {
        name: 'X-RAY',
        createdAt: '2020-01-01 00:00:00',
        updatedAt: '2020-01-01 00:00:00',
    }
    const mockServerList = [
        {
            name: 'X-RAY',
            createdAt: '2020-01-01 00:00:00',
            updatedAt: '2020-01-01 00:00:00',
        },
        {
            name: 'ZULU',
            createdAt: '2020-01-01 00:00:00',
            updatedAt: '2020-01-01 00:00:00',
        },
        {
            name: 'YANKEE',
            createdAt: '2020-01-01 00:00:00',
            updatedAt: '2020-01-01 00:00:00'
        }
    ]
    

    beforeEach(() => {
        token = jwt.sign({ id: mockId }, config.jwtSecret);
        User.findByPk = jest.fn().mockResolvedValue(mockCurrentUser);
        Server.findAll = jest.fn().mockResolvedValue(mockServerList);
        Server.findByPk = jest.fn().mockResolvedValue(mockServer);
        Server.create = jest.fn().mockResolvedValue(mockServer);
        Server.update = jest.fn().mockResolvedValue(mockServer);
    })

    /**************************************************************************************************
     **************************************************************************************************
     * Tests for getAll servers
     **************************************************************************************************
     **************************************************************************************************/
    it('[getAll] Should return 200 and the server list', async () => {
        const response = await request(app).get('/api/server').set('authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockServerList);
    });

    it('[getAll] Request without token should return 401 status', async () => {
        const response = await request(app).get('/api/server');
        expect(response.statusCode).toBe(401)
    })

    /**************************************************************************************************
     **************************************************************************************************
     * Tests for getOne server by name
     **************************************************************************************************
     **************************************************************************************************/
    it('[get] Valid request should return 200 and the server', async () => {
        const response = await request(app).get('/api/server/X-RAY').set('authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(mockServer)
    })

    it('[get] Request without token should return 401 status', async () => {
        const response = await request(app).get('/api/server/X-RAY');
        expect(response.statusCode).toBe(401)
    })

    it('[get] Request with unknow name should return 404 status', async () => {
        Server.findByPk = jest.fn().mockResolvedValue(null);
        const response = await request(app).get('/api/server/UNKNOWN').set('authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(404)
    })

    it('[get] Request with too short name should return 400 status', async () => {
        const response = await request(app).get('/api/server/1').set('authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(400)
    })

    it('[get] Request with too long name should return 400 status', async () => {
        const response = await request(app).get('/api/server/AZERTYUIOPQSDFGHJKLMWXCVBN12345613456').set('authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(400)
    })

    /**************************************************************************************************
     **************************************************************************************************
     * Tests for create server
     **************************************************************************************************
     **************************************************************************************************/
    it('[create] Valid request should return 201 and the server', async () => {
        const createServer = { name: 'X-RAY' }
        const response = await request(app).post('/api/server').set('authorization', `Bearer ${token}`).send(createServer);
        expect(response.statusCode).toBe(201)
        expect(response.body.name).toEqual(createServer.name)
    })

    it('[create] Request without token should return 401 status', async () => {
        const createServer = { name: 'X-RAY' }
        const response = await request(app).post('/api/server').send(createServer);
        expect(response.statusCode).toBe(401)
    })

    it('[create] Request with missing name should return 400 status', async () => {
        const createServer = { name: '' }
        const response = await request(app).post('/api/server').set('authorization', `Bearer ${token}`).send(createServer);
        expect(response.statusCode).toBe(400)
    })

    it('[create] Request with too short name should return 400 status', async () => {
        const createServer = { name: '1' }
        const response = await request(app).post('/api/server').set('authorization', `Bearer ${token}`).send(createServer);
        expect(response.statusCode).toBe(400)
    })

    it('[create] Request with too long name should return 400 status', async () => {
        const createServer = { name: 'AZERTYUIOPQSDFGHJKLMWXCVBN12345613456' }
        const response = await request(app).post('/api/server').set('authorization', `Bearer ${token}`).send(createServer);
        expect(response.statusCode).toBe(400)
    })

    it('[create] Request with existing name should return 500 status', async () => {
        Server.create = jest.fn().mockRejectedValue({ name: 'SequelizeUniqueConstraintError' });
        const createServer = { name: 'X-RAY' }
        const response = await request(app).post('/api/server').set('authorization', `Bearer ${token}`).send(createServer);
        expect(response.statusCode).toBe(500)
    })

    /**************************************************************************************************
     **************************************************************************************************
     * Tests for update server
     **************************************************************************************************
     **************************************************************************************************/
    it('[update] Valid request should return 200 and the server', async () => {
        const updateServer = { name: 'X-RAY' }
        const response = await request(app).put('/api/server/X-RAY').set('authorization', `Bearer ${token}`).send(updateServer);
        expect(response.statusCode).toBe(200)
    })

    it('[update] Request without token should return 401 status', async () => {
        const updateServer = { name: 'X-RAY' }
        const response = await request(app).put('/api/server/X-RAY').send(updateServer);
        expect(response.statusCode).toBe(401)
    })

    it('[update] Request with missing name should return 400 status', async () => {
        const updateServer = { name: '' }
        const response = await request(app).put('/api/server/X-RAY').set('authorization', `Bearer ${token}`).send(updateServer);
        expect(response.statusCode).toBe(400)
    })

    it('[update] Request with too short name should return 400 status', async () => {
        const updateServer = { name: '1' }
        const response = await request(app).put('/api/server/X-RAY').set('authorization', `Bearer ${token}`).send(updateServer);
        expect(response.statusCode).toBe(400)
    })

    it('[update] Request with too long name should return 400 status', async () => {
        const updateServer = { name: 'AZERTYUIOPQSDFGHJKLMWXCVBN12345613456' }
        const response = await request(app).put('/api/server/X-RAY').set('authorization', `Bearer ${token}`).send(updateServer);
        expect(response.statusCode).toBe(400)
    })

    it('[update] Request with existing name should return 500 status', async () => {
        Server.update = jest.fn().mockRejectedValue({ name: 'error message' });
        const updateServer = { name: 'X-RAY' }
        const response = await request(app).put('/api/server/X-RAY').set('authorization', `Bearer ${token}`).send(updateServer);
        expect(response.statusCode).toBe(500)
    })

    /**************************************************************************************************
     **************************************************************************************************
     * Tests for delete server
     **************************************************************************************************
     **************************************************************************************************/
     it('[delete] Valid request should return 200 and the server', async () => {
        const mockServerToDelete = {
            name: 'X-RAY',
            createdAt: '2020-01-01 00:00:00',
            updatedAt: '2020-01-01 00:00:00',
        }
        Server.findByPk             = jest.fn().mockResolvedValue(mockServerToDelete);
        mockServerToDelete.destroy  = jest.fn().mockResolvedValue(1);
        const response              = await request(app).delete('/api/server/X-RAY').set('authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(1)
    })

    it('[delete] Request without token should return 401 status', async () => {
        const response = await request(app).delete('/api/server/X-RAY');
        expect(response.statusCode).toBe(401)
    })

    it('[delete] Request with bad name should return 404 status', async () => {
        Server.findByPk = jest.fn().mockResolvedValue(null);
        const response = await request(app).delete('/api/server/UNKNOWN').set('authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(404)
    })

    it('[delete] Request with too short name should return 400 status', async () => {
        const response = await request(app).delete('/api/server/1').set('authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(400)
    })

    it('[delete] Request with too long name should return 400 status', async () => {
        const response = await request(app).delete('/api/server/AZERTYUIOPQSDFGHJKLMWXCVBN12345613456').set('authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(400)
    })

    it('[delete] Request with no rows affected should return 200 status', async () => {
        const mockServerToDelete = {
            name: 'X-RAY',
            createdAt: '2020-01-01 00:00:00',
            updatedAt: '2020-01-01 00:00:00',
        }
        Server.findByPk             = jest.fn().mockResolvedValue(mockServerToDelete);
        mockServerToDelete.destroy  = jest.fn().mockResolvedValue(0);
        const response              = await request(app).delete('/api/server/X-RAY').set('authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(0)
    })

    afterEach(() => {
        jest.clearAllMocks();
    })
});