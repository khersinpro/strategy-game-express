const request   = require('supertest');
const { app }   = require('../../../../server');
const jwt       = require('jsonwebtoken');
const config    = require('../../../../config');
const User      = require('../../../../database/models/user');
const Village_training_progress = require('../../../../database/models/village_training_progress');

describe('Village trainin progress controller', () => {
    let token;
    const mockId = 1;
    const mockCurrentUser =  {
        id: 1,
        username: 'test',
        email: 'test@test.fr',
        role_name: 'ROLE_ADMIN'
    }

    const mockVillageTrainingProgress = {
        id: 1,
        training_start: '2021-01-01',
        training_end: '2021-01-02',
        unit_to_train_count: 10,
        trained_unit_count: 5,
        single_training_duration: 1000,
        village_id: 1,
        village_building_id: 1,
        village_unit_id: 1,
        enabled: true,
        archived: false
    }

    const mockVillageTrainingProgressList = [
        {
            id: 1,
            training_start: '2021-01-01',
            training_end: '2021-01-02',
            unit_to_train_count: 10,
            trained_unit_count: 5,
            single_training_duration: 1000,
            village_id: 1,
            village_building_id: 1,
            village_unit_id: 1,
            enabled: true,
            archived: false
        },
        {
            id: 2,
            training_start: '2021-01-01',
            training_end: '2021-01-02',
            unit_to_train_count: 10,
            trained_unit_count: 5,
            single_training_duration: 1000,
            village_id: 1,
            village_building_id: 1,
            village_unit_id: 1,
            enabled: true,
            archived: false
        }
    ]

    beforeEach(() => {
        token = jwt.sign({ id: mockId }, config.jwtSecret);
        User.findByPk = jest.fn().mockResolvedValue(mockCurrentUser);
        Village_training_progress.findAll = jest.fn().mockResolvedValue(mockVillageTrainingProgressList);
    });

    /**********************************************************************************************
     * ********************************************************************************************
     * Tests for getAll village training progress
     * ******************************************************************************************** 
     *********************************************************************************************/
    it('[getAll] should return all village training progress', async () => {
        const response = await request(app)
            .get('/api/village-training-progress')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockVillageTrainingProgressList);
    })

    it('[getAll] should return 401 if no token', async () => {
        const response = await request(app)
            .get('/api/village-training-progress');

        expect(response.statusCode).toBe(401);
    })

    it('[getAll] should return 401 if invalid token', async () => {
        const response = await request(app)
            .get('/api/village-training-progress')
            .set('Authorization', `Bearer invalidToken`);

        expect(response.statusCode).toBe(401);
    })

    /**********************************************************************************************
     * ********************************************************************************************
     * Tests for getById village training progress
     * ******************************************************************************************** 
     *********************************************************************************************/

    /**********************************************************************************************
     * ********************************************************************************************
     * Tests for create village training progress
     * ******************************************************************************************** 
     *********************************************************************************************/

    /**********************************************************************************************
     * ********************************************************************************************
     * Tests for update village training progress
     * ******************************************************************************************** 
     *********************************************************************************************/

    /**********************************************************************************************
     * ********************************************************************************************
     * Tests for delete village training progress
     * ******************************************************************************************** 
     *********************************************************************************************/

    /**********************************************************************************************
     * ********************************************************************************************
     * Tests for cancel village training progress
     * ******************************************************************************************** 
     *********************************************************************************************/



    afterEach(() => {
        jest.clearAllMocks();
    });
});