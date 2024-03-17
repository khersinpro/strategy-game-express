const request   = require('supertest'); 
const { app }   = require('../../../../server');
const jwt       = require('jsonwebtoken');
const config    = require('../../../../config');
const { User, Village_construction_progress } = require('../../../../database/index').models;

describe('Village Construction Progress Controller', () => {
    let token;

    const mockUsersList = [
        {
            id: 1,
            username: 'test',
            email: 'test@test.fr',
            role_name: 'ROLE_ADMIN'
        },
        {
            id: 2,
            username: 'test2',
            email: 'test2@test2.fr',
            role_name: 'ROLE_USER'
        }
    ]

    const mockVillageConstructionProgressList = [
        {   
            id: 1,
            type: 'village_new_construction',
            construction_start: '2021-01-01 00:00:00',
            construction_end: '2021-01-01 00:00:01',
            enabled: true,
            archived: false,
            village_id: 1,
            createdAt: '2021-01-01 00:00:00',
            updatedAt: '2021-01-01 00:00:00'
        },
        {   
            id: 2,
            type: 'village_update_construction',
            construction_start: '2021-01-01 00:00:00',
            construction_end: '2021-01-01 00:00:01',
            enabled: true,
            archived: false,
            village_id: 1,
            createdAt: '2021-01-01 00:00:00',
            updatedAt: '2021-01-01 00:00:00'
        }
    ]


    beforeAll(() => {
        token = jwt.sign({ id: 1 }, config.jwtSecret, { expiresIn: '1h' });
        User.findOne = jest.fn().mockResolvedValue(mockUsersList[0]);
        Village_construction_progress.findAll = jest.fn().mockResolvedValue(mockVillageConstructionProgressList);
        Village_construction_progress.findByPk = jest.fn().mockResolvedValue(mockVillageConstructionProgressList[0]);
    })

    /*************************************************************************************************************
     * Tests for getAll controller
     *************************************************************************************************************/

    it('[getAll] should return 200 status code and mock village_construction_progress', async () => {
        const response = await request(app)
            .get('/api/village-construction-progress')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockVillageConstructionProgressList);
    })

    it('[getAll should return 401 status code if no token is provided', async () => {
        const response = await request(app)
            .get('/api/village-construction-progress');
        expect(response.statusCode).toBe(401);
    })

    /*************************************************************************************************************
     * Tests for getAll controller
     *************************************************************************************************************/

    it('[get] should return 200 status code and mock village_construction_progress', async () => {
        const response = await request(app)
            .get('/api/village-construction-progress/1')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockVillageConstructionProgressList[0]);
    })

    it('[get] should return 401 status code if no token is provided', async () => {
        const response = await request(app)
            .get('/api/village-construction-progress/1');
        expect(response.statusCode).toBe(401);
    })

    it('[get] should return 404 status code if village_construction_progress is not found', async () => {
        Village_construction_progress.findByPk = jest.fn().mockResolvedValue(null);
        const response = await request(app)
        .get('/api/village-construction-progress/1')
        .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(404);
    })
    
    it('[get] should return 400 status code if id is not a number', async () => {
        const response = await request(app)
            .get('/api/village-construction-progress/abc')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(400);
    })

    /*************************************************************************************************************
     * Tests for createNewBuilding controller
     *************************************************************************************************************/ 


    afterEach(() => {
        jest.clearAllMocks();
    })
})