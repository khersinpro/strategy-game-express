const request   = require('supertest'); // simule une requette http
const { app }   = require('../../../../server');
const jwt       = require('jsonwebtoken');
const config    = require('../../../../config');
const { User, Village, Village_building }  = require('../../../../database/index').models;

describe('Village building controller', () => {
    let token;
    const mockId = 1;
    const mockCurrentUser =  {
        id: 1,
        username: 'test',
        email: 'test@test.fr',
        role_name: 'ROLE_USER'
    }

    const mockVillageBuilding = {
        id: 1,
        village_id: 1,
        type: 'resource_building',
        building_name: 'iron mine',
        building_level_id: 57,
        createdAt: '2020-04-01T13:00:00.000Z',
        updatedAt: '2020-04-01T13:00:00.000Z',
    }

    const mockVillageBuildingList = [
        {
            id: 1,
            village_id: 1,
            type: 'resource_building',
            building_name: 'iron mine',
            building_level_id: 1,
            createdAt: '2020-04-01T13:00:00.000Z',
            updatedAt: '2020-04-01T13:00:00.000Z',
        },
        {
            id: 2,
            village_id: 1,
            type: 'storage_building',
            building_name: 'iron storage',
            building_level_id: 67,
            createdAt: '2020-04-01T13:00:00.000Z',
            updatedAt: '2020-04-01T13:00:00.000Z',
        },
        {
            id: 9,
            village_id: 1,
            type: 'town_all_building',
            building_name: 'town hall',
            building_level_id: 127,
            createdAt: '2020-04-01T13:00:00.000Z',
            updatedAt: '2020-04-01T13:00:00.000Z',
        },
        {
            id: 10,
            village_id: 1,
            type: 'wall_building',
            building_name: 'greek wall',
            building_level_id: 45,
            createdAt: '2020-04-01T13:00:00.000Z',
            updatedAt: '2020-04-01T13:00:00.000Z',
        }
    ]

    beforeEach(() => {
        token = jwt.sign({ id: mockId }, config.jwtSecret);
        User.findByPk = jest.fn().mockResolvedValue(mockCurrentUser);
        Village_building.findAll = jest.fn().mockResolvedValue(mockVillageBuildingList);
        Village_building.findByPk = jest.fn().mockResolvedValue(mockVillageBuilding);
        Village_building.create = jest.fn().mockResolvedValue(mockVillageBuilding);
    });

    /**********************************************************************************************
     * ********************************************************************************************
     * Tests for getAll village_building
     * ******************************************************************************************** 
     *********************************************************************************************/
    it('[getAll] should return 200 and a list of village_building', async () => {
        const res = await request(app).get('/api/village-building').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockVillageBuildingList);
    });

    it('[getAll] should return 401 if no token', async () => {
        const res = await request(app).get('/api/village-building');
        expect(res.status).toBe(401);
    });

    it('[getAll] should return 401 if token is invalid', async () => {
        let faketoken = 'g1321dfsg1dfs3dg546sdg4dfs64g6fd4s6g4dsf';
        const res = await request(app).get('/api/village-building').set('Authorization', `Bearer ${faketoken}`);
        expect(res.status).toBe(401);
    });

    /**********************************************************************************************
     * ********************************************************************************************
     * Tests for get one village_building by id
     * ******************************************************************************************** 
     *********************************************************************************************/
    it('[getOne] should return 200 and a village_building', async () => {
        const res = await request(app).get('/api/village-building/1').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockVillageBuilding);
    });

    it('[getOne] should return 401 if no token', async () => {
        const res = await request(app).get('/api/village-building/1');
        expect(res.status).toBe(401);
    });

    it('[getOne] should return 401 if token is invalid', async () => {
        let faketoken = 'g1321dfsg1dfs3dg546sdg4dfs64g6fd4s6g4dsf';
        const res = await request(app).get('/api/village-building/1').set('Authorization', `Bearer ${faketoken}`);
        expect(res.status).toBe(401);
    });

    it('[getOne] should return 404 if village not found', async () => {
        Village_building.findByPk = jest.fn().mockResolvedValue(null);
        const res = await request(app).get('/api/village-building/1').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
    });

    /**********************************************************************************************
     * ********************************************************************************************
     * Tests for create village_building
     * ********************************************************************************************
     * ********************************************************************************************/
    it('[create] should return 403 for basic user', async () => {
        const res = await request(app).post('/api/village-building').set('Authorization', `Bearer ${token}`).send(mockVillageBuilding);
        expect(res.status).toBe(403);
    });

    it('[create] should return 401 if no token', async () => {
        const res = await request(app).post('/api/village-building').send(mockVillageBuilding);
        expect(res.status).toBe(401);
    });

    it('[create] should return 201 for admin user', async () => {
        mockCurrentUser.role_name = 'ROLE_ADMIN';
        const res = await request(app).post('/api/village-building').set('Authorization', `Bearer ${token}`).send(mockVillageBuilding);
        expect(res.status).toBe(201);
    });

    it('[create] should return 400 if village_building is not valid', async () => {
        mockCurrentUser.role_name = 'ROLE_ADMIN';
        mockVillageBuilding.building_name = '';
        const res = await request(app).post('/api/village-building').set('Authorization', `Bearer ${token}`).send(mockVillageBuilding);
        expect(res.status).toBe(400);
    });

    /**********************************************************************************************
     * ********************************************************************************************
     * Tests for update village_building
     * ********************************************************************************************
     * ********************************************************************************************/




    afterEach(() => {
        jest.clearAllMocks();
    });
});