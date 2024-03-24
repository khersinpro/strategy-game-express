const request       = require('supertest');
const { app }       = require('../../../../server');
const jwt           = require('jsonwebtoken');
const config        = require('../../../../config');
const User          = require('../../../../database/models/user');
const Village_unit  = require('../../../../database/models/village_unit');

describe('Village unit controller', () => {
    let token;
    const mockId = 1;
    const mockCurrentUser =  {
        id: 1,
        username: 'test',
        email: 'test@test.fr',
        role_name: 'ROLE_ADMIN'
    }

    const mockVillageUnit = {
        id: 1,
        unit_name: 'berserker',
        village_id: 1,
        total_quantity: 1,
        present_quantity: 1,
        in_attack_quantity: 0,
        in_support_quantity: 0,
        createdAt: '2021-07-30T14:00:00.000Z',
        updatedAt: '2021-07-30T14:00:00.000Z'
    }

    const mockVillageUnits = [
        mockVillageUnit,
        {
            id: 2,
            unit_name: 'archer',
            village_id: 1,
            total_quantity: 1,
            present_quantity: 1,
            in_attack_quantity: 0,
            in_support_quantity: 0,
            createdAt: '2021-07-30T14:00:00.000Z',
            updatedAt: '2021-07-30T14:00:00.000Z'
        }
    ]

    beforeEach(() => {
        token = jwt.sign({ id: mockId }, config.jwtSecret);
        User.findByPk = jest.fn().mockResolvedValue(mockCurrentUser);
        Village_unit.findAll = jest.fn().mockResolvedValue(mockVillageUnits);
        Village_unit.findByPk = jest.fn().mockResolvedValue(mockVillageUnit);
        Village_unit.create = jest.fn().mockResolvedValue(1);
        Village_unit.update = jest.fn().mockResolvedValue(1);
    });

    /**********************************************************************************************************************
     * ********************************************************************************************************************
     * Get all village units
     * ********************************************************************************************************************
     * ********************************************************************************************************************/
    it('[getAll] Should return 200 and an array of village units', async () => {
        const response = await request(app)
            .get('/api/village-unit')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockVillageUnits);
    });

    it('[getAll] Should return 401 if no token', async () => {
        const response = await request(app)
            .get('/api/village-unit');

        expect(response.status).toBe(401);
    });

    it('[getAll] Should return 401 if invalid token', async () => {
        const response = await request(app)
            .get('/api/village-unit')
            .set('Authorization', `Bearer invalidToken`);

        expect(response.status).toBe(401);
    });

    /**********************************************************************************************************************
     * ********************************************************************************************************************
     * Get village unit by id
     * ********************************************************************************************************************
     * ********************************************************************************************************************/
    it('[get] Should return 200 and a village unit', async () => {
        const response = await request(app)
            .get(`/api/village-unit/${mockId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockVillageUnit);
    });

    it('[get] Should return 401 if no token', async () => {
        const response = await request(app)
            .get(`/api/village-unit/${mockId}`);

        expect(response.status).toBe(401);
    });

    it('[get] Should return 401 if invalid token', async () => {
        const response = await request(app)
            .get(`/api/village-unit/${mockId}`)
            .set('Authorization', `Bearer invalidToken`);

        expect(response.status).toBe(401);
    });

    it('[get] Should return 404 if village unit not found', async () => {
        Village_unit.findByPk = jest.fn().mockResolvedValue(null);
        const response = await request(app)
            .get(`/api/village-unit/${mockId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
    });

    it('[get] Should return 400 if id is not an integer', async () => {
        const response = await request(app)
            .get(`/api/village-unit/invalidId`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });

    /**********************************************************************************************************************
     * ********************************************************************************************************************
     * Create village unit
     * ********************************************************************************************************************
     * ********************************************************************************************************************/
    it('[create] Should return 201 and a village unit', async () => {
        const response = await request(app)
            .post('/api/village-unit')
            .set('Authorization', `Bearer ${token}`)
            .send(mockVillageUnit);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(1);
    }); 

    it('[create] Should return 401 if no token', async () => {
        const response = await request(app)
            .post('/api/village-unit')
            .send(mockVillageUnit);

        expect(response.status).toBe(401);
    });

    it('[create] Should return 401 if invalid token', async () => {
        const response = await request(app)
            .post('/api/village-unit')
            .set('Authorization', `Bearer invalidToken`)
            .send(mockVillageUnit);

        expect(response.status).toBe(401);
    });

    it('[create] Should return 403 if user is not admin', async () => {
        User.findByPk = jest.fn().mockResolvedValue({ ...mockCurrentUser, role_name: 'ROLE_USER' });
        const response = await request(app)
            .post('/api/village-unit')
            .set('Authorization', `Bearer ${token}`)
            .send(mockVillageUnit);

        expect(response.status).toBe(403);
    });

    it('[create] Should return 400 if village_id is not an integer', async () => {
        const response = await request(app)
            .post('/api/village-unit')
            .set('Authorization', `Bearer ${token}`)
            .send({ ...mockVillageUnit, village_id: 'invalidId' });

        expect(response.status).toBe(400);
    });

    /**********************************************************************************************************************
     * ********************************************************************************************************************
     * Update village unit
     * ********************************************************************************************************************
     * ********************************************************************************************************************/
    it('[update] Should return 200 and a village unit', async () => {
        const response = await request(app)
            .put(`/api/village-unit/${mockId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(mockVillageUnit);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(1);
    });

    it('[update] Should return 401 if no token', async () => {
        const response = await request(app)
            .put(`/api/village-unit/${mockId}`)
            .send(mockVillageUnit);

        expect(response.status).toBe(401);
    });

    it('[update] Should return 401 if invalid token', async () => {
        const response = await request(app)
            .put(`/api/village-unit/${mockId}`)
            .set('Authorization', 'Bearer invalidToken')
            .send(mockVillageUnit);

        expect(response.status).toBe(401);
    });

    it('[update] Should return 403 if user is not admin', async () => {
        User.findByPk = jest.fn().mockResolvedValue({ ...mockCurrentUser, role_name: 'ROLE_USER' });
        const response = await request(app)
            .put(`/api/village-unit/${mockId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(mockVillageUnit);

        expect(response.status).toBe(403);
    });

    it('[update] Should return 400 if id is not an integer', async () => {
        const response = await request(app)
            .put(`/api/village-unit/invalidId`)
            .set('Authorization', `Bearer ${token}`)
            .send(mockVillageUnit);

        expect(response.status).toBe(400);
    });

    /**********************************************************************************************************************
     * ********************************************************************************************************************
     * Delete village unit
     * ********************************************************************************************************************
     * ********************************************************************************************************************/
    it('[delete] Should return 204', async () => {
        const mockVIllageUniitToDelete = {
            ...mockVillageUnit,
            destroy: jest.fn().mockResolvedValue(1)
        };

        Village_unit.findByPk = jest.fn().mockResolvedValue(mockVIllageUniitToDelete);

        const response = await request(app)
            .delete(`/api/village-unit/${mockId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
    });

    it('[delete] Should return 401 if no token', async () => {
        const response = await request(app)
            .delete(`/api/village-unit/${mockId}`);

        expect(response.status).toBe(401);
    });

    it('[delete] Should return 401 if invalid token', async () => {
        const response = await request(app)
            .delete(`/api/village-unit/${mockId}`)
            .set('Authorization', `Bearer invalidToken`);

        expect(response.status).toBe(401);
    });

    it('[delete] Should return 403 if user is not admin', async () => {
        User.findByPk = jest.fn().mockResolvedValue({ ...mockCurrentUser, role_name: 'ROLE_USER' });
        const response = await request(app)
            .delete(`/api/village-unit/${mockId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(403);
    });

    it('[delete] Should return 400 if id is not an integer', async () => {
        const response = await request(app)
            .delete(`/api/village-unit/invalidId`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});