const request   = require('supertest');
const { app }   = require('../../../server');
const jwt       = require('jsonwebtoken');
const config    = require('../../../config');
const { Role, User }  = require('../../../database/index').models;


describe('Test for role controller', () => {
    let token
    const mockId = 1

    const mockAuthUser = {
        id: mockId,
        userName: 'connectedUser',
        email: 'connecteduser@gmail.com',
        role_name: 'ROLE_ADMIN',
    }

    const mockRoleList = [
        {
            name: 'ROLE_USER',
            createdAt: '2020-12-01T14:00:00.000Z',
            updatedAt: '2020-12-01T14:00:00.000Z'
        },
        {
            name: 'ROLE_ADMIN',
            createdAt: '2020-12-01T14:00:00.000Z',
            updatedAt: '2020-12-01T14:00:00.000Z'
        },
    ]

    const mockCreateRole = {
        name: 'ROLE_CREATED',
        createdAt: '2020-12-01T14:00:00.000Z',
        updatedAt: '2020-12-01T14:00:00.000Z'
    }

    /**
     * Mocking sequelize methods
     */
    beforeEach(() => {   
        token = jwt.sign({id: mockId}, config.jwtSecret, {expiresIn: '7d'});
        Role.findAll = jest.fn().mockResolvedValue(mockRoleList);
        Role.findByPk = jest.fn().mockResolvedValue(mockRoleList[0]);
        Role.create = jest.fn().mockResolvedValue(mockCreateRole);
        Role.update = jest.fn().mockResolvedValue(1);
        User.findByPk = jest.fn().mockResolvedValue(mockAuthUser);
    })

    /**
     * Get all roles tests
     */
    test('[getAll] vallid request should return a role array and status code 200', async () => {
        const response = await request(app).get('/api/role').set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockRoleList);
    })

    test('[getAll] request without authorization should return 401 ', async () => {
        const response = await request(app).get('/api/role');
        expect(response.statusCode).toBe(401);
    })

    /**
     * Get role by id tests
     */
    test('[get] request with valid id should return 200 and role', async () => {
        const response = await request(app).get('/api/role/ROLE_USER').set('Authorization', `Bearer ${token}`);
        expect(response.body).toEqual(mockRoleList[0]);
        expect(response.statusCode).toBe(200);
    })

    test('[get] request with invalid id should return 400', async () => {
        const response = await request(app).get('/api/role/1').set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(400);
    })

    test('[get] request without authorization should return 401 ', async () => {
        const response = await request(app).get('/api/role/ROLE_USER');
        expect(response.statusCode).toBe(401);
    })

    test('[get] request with unknown id should return 404', async () => {
        Role.findByPk = jest.fn().mockResolvedValue(null);
        const response = await request(app).get('/api/role/ROLE_UNKNOWN').set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(404);
    })

    /**
     * Create role tests
     */
    test('[create] request with valid body should return 201 and role created', async () => {
        const response = await request(app).post('/api/role').set('Authorization', `Bearer ${token}`).send(mockCreateRole);
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(mockCreateRole);
    })

    test('[create] request without authorization should return 401 ', async () => {
        const response = await request(app).post('/api/role').send(mockCreateRole);
        expect(response.statusCode).toBe(401);
    })

    test('[create] request with invalid body should return 400', async () => {
        const response = await request(app).post('/api/role').set('Authorization', `Bearer ${token}`).send({name: 10});
        expect(response.statusCode).toBe(400);
    })

    /**
     * Update role tests
     */
    test('[update requesr with valid id and body should return 204]', async () => {
        const response = await request(app).put('/api/role/ROLE_USER').set('Authorization', `Bearer ${token}`).send({name: 'ROLE_UPDATED'});
        expect(response.statusCode).toBe(204);
    })

    test('[update] request without authorization should return 401 ', async () => {
        const response = await request(app).put('/api/role/ROLE_USER').send({name: 'ROLE_UPDATED'});
        expect(response.statusCode).toBe(401);
    })

    test('[update] request with invalid id should return 400', async () => {
        const response = await request(app).put('/api/role/1').set('Authorization', `Bearer ${token}`).send({name: 'ROLE_UPDATED'});
        expect(response.statusCode).toBe(400);
    })

    test('[update] request with invalid body should return 400', async () => { 
        const response = await request(app).put('/api/role/ROLE_USER').set('Authorization', `Bearer ${token}`).send({name: 10});
        expect(response.statusCode).toBe(400);
    })

    /**
     * Delete role tests
     */
    test('[delete] valid request should return 204', async () => {
        const role = new Role(mockRoleList[0]);
        Role.findByPk = jest.fn().mockResolvedValue(role);
        role.destroy = jest.fn().mockResolvedValue(1);

        const response = await request(app).delete('/api/role/ROLE_USER').set('Authorization', `Bearer ${token}`);
            expect(response.body).toEqual({});  
        expect(response.statusCode).toBe(204);
    })

    test('[delete] request without authorization should return 401 ', async () => {
        const response = await request(app).delete('/api/role/ROLE_USER');
        expect(response.statusCode).toBe(401);
    })

    test('[delete] request with invalid id should return 400', async () => {
        const response = await request(app).delete('/api/role/1').set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(400);
    })

    test('[delete] request with unknown id should return 500 sequelize error', async () => {
        Role.findByPk = jest.fn().mockResolvedValue(null);
        const response = await request(app).delete('/api/role/ROLE_USER').set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(500);
    })
});