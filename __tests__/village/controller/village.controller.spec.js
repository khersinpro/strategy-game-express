const request   = require('supertest'); // simule une requette http
const { app }   = require('../../../server');
const jwt       = require('jsonwebtoken');
const config    = require('../../../config');
const { User, Village, Server }  = require('../../../database/index').models;
const VillageUpdateUtils = require('../../../utils/villlageUpdateUtils');

describe('Village controller', () => {
    let token;
    const mockId = 1;
    const mockCurrentUser =  {
        id: 1,
        username: 'test',
        email: 'test@test.fr',
        role_name: 'ROLE_ADMIN'
    }

    const mockVillage = {
        id: 1,
        name: 'test',
        user_id: 1,
        server_name: 1,
        civilization_name: 'greek',
        createdAt: '2020-04-01T13:00:00.000Z',
        updatedAt: '2020-04-01T13:00:00.000Z',
    }

    const mockVillageList = [
        {
            id: 1,
            name: 'test',
            user_id: 1,
            server_name: 1,
            civilization_name: 'greek',
            createdAt: '2020-04-01T13:00:00.000Z',
            updatedAt: '2020-04-01T13:00:00.000Z',
        },
        {
            id: 2,
            name: 'test2',
            user_id: 1,
            server_name: 1,
            civilization_name: 'greek',
            createdAt: '2020-04-01T13:00:00.000Z',
            updatedAt: '2020-04-01T13:00:00.000Z',
        }
    ]

    beforeEach(() => {
        token = jwt.sign({ id: mockId }, config.jwtSecret);
        User.findByPk = jest.fn().mockResolvedValue(mockCurrentUser);
        Village.findAll = jest.fn().mockResolvedValue(mockVillageList);
        Village.findByPk = jest.fn().mockResolvedValue(mockVillage);
        VillageUpdateUtils.updateVillageData = jest.fn().mockResolvedValue();
    });

    /**********************************************************************************************
     * ********************************************************************************************
     * Tests for getAll villages
     * ******************************************************************************************** 
     *********************************************************************************************/
    it('[getAll] should return 200 and a list of villages', async () => {
        const res = await request(app).get('/api/village').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockVillageList);
    });

    it('[getAll] should return 401 if no token', async () => {
        const res = await request(app).get('/api/village');
        expect(res.status).toBe(401);
    });

    it('[getAll] should return 401 if token is invalid', async () => {
        let faketoken = 'g1321dfsg1dfs3dg546sdg4dfs64g6fd4s6g4dsf';
        const res = await request(app).get('/api/village').set('Authorization', `Bearer ${faketoken}`);
        expect(res.status).toBe(401);
    });

    /**********************************************************************************************
     * ********************************************************************************************
     * Tests for get one village by id
     * ******************************************************************************************** 
     *********************************************************************************************/
    it('[getOne] should return 200 and a village', async () => {
        const res = await request(app).get('/api/village/1').set('Authorization', `Bearer ${token}`);
        expect(res.body).toEqual(mockVillage);
        expect(res.status).toBe(200);
    });

    it('[getOne] should return 401 if no token', async () => {
        const res = await request(app).get('/api/village/1');
        expect(res.status).toBe(401);
    });

    it('[getOne] should return 401 if token is invalid', async () => {
        let faketoken = 'g1321dfsg1dfs3dg546sdg4dfs64g6fd4s6g4dsf';
        const res = await request(app).get('/api/village/1').set('Authorization', `Bearer ${faketoken}`);
        expect(res.status).toBe(401);
    });

    it('[getOne] should return 404 if village not found', async () => {
        Village.findByPk = jest.fn().mockResolvedValue(null);
        const res = await request(app).get('/api/village/1').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
    });



    afterEach(() => {
        jest.clearAllMocks();
    });
});