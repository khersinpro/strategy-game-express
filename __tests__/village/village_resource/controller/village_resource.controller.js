const request   = require('supertest'); // simule une requette http
const { app }   = require('../../../../server');
const jwt       = require('jsonwebtoken');
const config    = require('../../../../config');
const { User, Village_resource }  = require('../../../../database/index').models;

describe('Village controller', () => {
    let token;
    const mockId = 1;
    const mockCurrentUser =  {
        id: 1,
        username: 'test',
        email: 'test@test.fr',
        role_name: 'ROLE_ADMIN'
    }

    const mockVillageResource = {
        id: 1,
        village_id: 1,
        resource_name: 'iron',
        quantity: 100,
        updatedAt: '2021-01-01 00:00:00',
        createdAt: '2021-01-01 00:00:00'
    }

    const mockVillageResourceList = [
        {
            id: 1,
            village_id: 1,
            resource_name: 'wood',
            quantity: 100,
            updatedAt: '2021-01-01 00:00:00',
            createdAt: '2021-01-01 00:00:00'
        },
        {
            id: 2,
            village_id: 1,
            resource_name: 'iron',
            quantity: 100,
            updatedAt: '2021-01-01 00:00:00',
            createdAt: '2021-01-01 00:00:00'
        }
    ];


    beforeEach(() => {
        token = jwt.sign({ id: mockId }, config.jwtSecret);
        User.findByPk = jest.fn().mockResolvedValue(mockCurrentUser);
        Village_resource.findAll = jest.fn().mockResolvedValue(mockVillageResourceList);
        Village_resource.findByPk = jest.fn().mockResolvedValue(mockVillageResource);
        Village_resource.create = jest.fn().mockResolvedValue(1);
        Village_resource.update = jest.fn().mockResolvedValue(1);
    });

    /****************************************************************************************************************
     * **************************************************************************************************************
     * Get all village resources
     * **************************************************************************************************************
     * **************************************************************************************************************/
    it('[getAll] should return all village resources', async () => {    
        const response = await request(app)
            .get('/api/village-resource')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockVillageResourceList);
    });

    it('[getAll] should return 401 if no token', async () => {
        const response = await request(app)
            .get('/api/village-resource');

        expect(response.status).toBe(401);
    });

    /****************************************************************************************************************
     * **************************************************************************************************************
     * Get village resource by id
     * **************************************************************************************************************
     * **************************************************************************************************************/
    it('[get] should return village resource by id', async () => {
        const response = await request(app)
            .get(`/api/village-resource/1`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockVillageResource);
    }); 

    it('[get] should return 401 if no token', async () => {
        const response = await request(app)
            .get(`/api/village-resource/1`);

        expect(response.status).toBe(401);
    });

    it('[get] should return 404 if village resource not found', async () => {
        Village_resource.findByPk = jest.fn().mockResolvedValue(null);
        const response = await request(app)
            .get(`/api/village-resource/1`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
    });

    it('[get] should return 400 if wrong param type', async () => { 
        const response = await request(app)
            .get(`/api/village-resource/abc`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });

    /****************************************************************************************************************
     * **************************************************************************************************************
     * Create village resource
     * **************************************************************************************************************
     * **************************************************************************************************************/
    it('[create] should create a village resource', async () => {
        const newVillageResource = {
            village_id: 1,
            resource_name: 'wood',
            quantity: 100
        }

        const response = await request(app)
            .post('/api/village-resource')
            .send(newVillageResource)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(1);
    });

    it('[create] should return 401 if no token', async () => {
        const response = await request(app)
            .post('/api/village-resource');

        expect(response.status).toBe(401);
    });

    it('[create] should return 400 if missing fields', async () => {
        const response = await request(app)
            .post('/api/village-resource')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });

    it('[create] should return 400 if wrong fields type', async () => {
        const newVillageResource = {
            village_id: 'abc',
            resource_name: 123,
            quantity: 'abc'
        }

        const response = await request(app)
            .post('/api/village-resource')
            .send(newVillageResource)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });

    it('[create] should return 403 if user is not admin role', async () => {
        User.findByPk = jest.fn().mockResolvedValue({ ...mockCurrentUser, role_name: 'ROLE_USER' });
        const response = await request(app)
            .post('/api/village-resource')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(403);
    });

    /****************************************************************************************************************
     * **************************************************************************************************************
     * Update village resource
     * **************************************************************************************************************
     * **************************************************************************************************************/
    it('[update] should update a village resource', async () => {
        const updatedVillageResource = {
            village_id: 1,
            resource_name: 'wood',
            quantity: 100
        }

        const response = await request(app)
            .put('/api/village-resource/1')
            .send(updatedVillageResource)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(1);
    });

    it('[update] should return 401 if no token', async () => {
        const response = await request(app)
            .put('/api/village-resource/1');

        expect(response.status).toBe(401);
    });

    it('[update] should return 400 if wrong param type', async () => {
        const response = await request(app)
            .put('/api/village-resource/abc')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });

    it('[update] should return 400 if wrong fields type', async () => {
        const updatedVillageResource = {
            village_id: 'abc',
            resource_name: 123,
            quantity: 'abc'
        }

        const response = await request(app)
            .put('/api/village-resource/1')
            .send(updatedVillageResource)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });

    it('[update] should return 403 if user is not admin role', async () => {
        User.findByPk = jest.fn().mockResolvedValue({ ...mockCurrentUser, role_name: 'ROLE_USER' });
        const response = await request(app)
            .put('/api/village-resource/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(403);
    });

    /****************************************************************************************************************
     * **************************************************************************************************************
     * Delete village resource
     * **************************************************************************************************************
     * **************************************************************************************************************/
    it('[delete] should delete a village resource', async () => {
        const villaResourceToDelete = {
            id: 1,
            village_id: 1,
            resource_name: 'wood',
            quantity: 100,
            updatedAt: '2021-01-01 00:00:00',
            createdAt: '2021-01-01 00:00:00'
        };

        Village_resource.findByPk = jest.fn().mockResolvedValue(villaResourceToDelete);
        villaResourceToDelete.destroy = jest.fn().mockResolvedValue(1);

        const response = await request(app)
            .delete('/api/village-resource/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
    });

    it('[delete] should return 401 if no token', async () => {
        const response = await request(app)
            .delete('/api/village-resource/1');

        expect(response.status).toBe(401);
    });

    it('[delete] should return 400 if wrong param type', async () => {
        const response = await request(app)
            .delete('/api/village-resource/abc')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });

    it('[delete] should return 404 if village resource not found', async () => {
        Village_resource.findByPk = jest.fn().mockResolvedValue(null);
        const response = await request(app)
            .delete('/api/village-resource/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
    });

    it('[delete] should return 403 if user is not admin role', async () => {
        User.findByPk = jest.fn().mockResolvedValue({ ...mockCurrentUser, role_name: 'ROLE_USER' });
        const response = await request(app)
            .delete('/api/village-resource/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(403);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});