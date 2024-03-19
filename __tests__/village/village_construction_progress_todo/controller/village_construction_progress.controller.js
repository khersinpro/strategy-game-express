const request   = require('supertest'); 
const { app }   = require('../../../../server');
const jwt       = require('jsonwebtoken');
const config    = require('../../../../config');
const { sequelize } = require('../../../../database/index');
const { User, Village_construction_progress, Village_new_construction, Building_level, Village_building, Village } = require('../../../../database/index').models;
const VillageService = require('../../../../api/village/village.service');
const BuildingService = require('../../../../api/building/building.service');
const VillageBuildingService = require('../../../../api/village/village_building/village_building.service');
const BuildingCostService = require('../../../../api/building/building_cost/building_cost.service');


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

    const mockVillageConstructionProgressNew = {
        id: 1,
        type: 'village_new_construction',
        construction_start: '2021-01-01 00:00:00',
        construction_end: '2021-01-01 00:00:01',
        enabled: true,
        archived: false,
        village_id: 1,
        createdAt: '2021-01-01 00:00:00',
        updatedAt: '2021-01-01 00:00:00'
    }

    const mockVillageNewConstruction = {
        id: 1,
        building_name: 'barrack',
        building_level_id: 1,
        createdAt: '2021-01-01 00:00:00',
        updatedAt: '2021-01-01 00:00:00'
    }

    const mockVillage = {
        id: 1,
        name: 'village',
        server_name: 'server',
        user_id: 1,
        civilization_name: 'civilization',
        user_id: 1,
        createdAt: '2021-01-01 00:00:00',
        updatedAt: '2021-01-01 00:00:00'
    }

    beforeAll(() => {
        token = jwt.sign({ id: 1 }, config.jwtSecret, { expiresIn: '1h' });
        User.findOne = jest.fn().mockResolvedValue(mockUsersList[0]);
        Village_construction_progress.findAll = jest.fn().mockResolvedValue(mockVillageConstructionProgressList);
        Village_construction_progress.findByPk = jest.fn().mockResolvedValue(mockVillageConstructionProgressList[0]);
        sequelize.transaction = jest.fn(() => {
            return {
                commit: jest.fn(),
                rollback: jest.fn()
            }
        });
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

    it('[createNewBuilding] Should return 201 and BuildingConstructionProgress with valide request', async () => {
        Village.findByPk = jest.fn().mockResolvedValue({
            ...mockVillage,
            isAdminOrVillageOwner: jest.fn().mockResolvedValue(true)
        });

        BuildingService.getByName = jest.fn().mockResolvedValue({ id: 1, name: 'barrack', is_common: true });
        VillageBuildingService.createUniqueVillageBuildingWhenConstructionProgressIsFinished = jest.fn().mockResolvedValue(true);
        VillageBuildingService.updateUniqueVillageBuildingWhenConstructionProgressIsFinished = jest.fn().mockResolvedValue(true);
        Village_building.findOne = jest.fn().mockResolvedValue(null);
        Village_construction_progress.findOne = jest.fn().mockResolvedValue(null);
        Building_level.findOne = jest.fn().mockResolvedValue({ id: 1, level: 1 });
        BuildingCostService.checkAndUpdateResourcesBeforeCreate = jest.fn().mockResolvedValue(true);

        Village_construction_progress.create = jest.fn().mockResolvedValue({
            ...mockVillageConstructionProgressNew,
            setDataValue: jest.fn().mockImplementation(function (key, value) {
                this[key] = value;
                return this;
            })
        });

        Village_new_construction.create = jest.fn().mockResolvedValue(mockVillageNewConstruction);

        const response = await request(app)
        .post('/api/village-construction-progress/new')
        .set('Authorization', `Bearer ${token}`)
        .send({
            village_id: 1,
            building_name: 'barrack'
        });

        const dataResponse = {
            ...mockVillageConstructionProgressNew,
            village_new_construction: {
                ...mockVillageNewConstruction
            }
        }

        expect(response.body).toEqual(dataResponse);
        expect(response.statusCode).toBe(201);
    })

    it('[createNewBuilding] Should return 404 if building to be created is not found', async () => {
        BuildingService.getByName = jest.fn().mockResolvedValue(null);

        const response = await request(app)
        .post('/api/village-construction-progress/new')
        .set('Authorization', `Bearer ${token}`)
        .send({
            village_id: 1,
            building_name: 'barrack'
        });

        expect(response.body).toEqual({error: 'Building not found'});
        expect(response.statusCode).toBe(404);
    })

    it('[createNewBuilding] Should return 403 if user try to create a building who already exist', async () => {
        Village.findByPk = jest.fn().mockResolvedValue({
            ...mockVillage,
            isAdminOrVillageOwner: jest.fn().mockResolvedValue(true)
        });

        BuildingService.getByName = jest.fn().mockResolvedValue({ id: 1, name: 'barrack', is_common: true });
        VillageBuildingService.createUniqueVillageBuildingWhenConstructionProgressIsFinished = jest.fn().mockResolvedValue(true);
        VillageBuildingService.updateUniqueVillageBuildingWhenConstructionProgressIsFinished = jest.fn().mockResolvedValue(true);
        Village_building.findOne = jest.fn().mockResolvedValue({ id: 1 });

        const response = await request(app)
        .post('/api/village-construction-progress/new')
        .set('Authorization', `Bearer ${token}`)
        .send({
            village_id: 1,
            building_name: 'barrack'
        });

        expect(response.body).toEqual({error: 'Building already exists in the village'});
        expect(response.statusCode).toBe(403);
    })

    it('[createNewBuilding] Should return 403 if user try to create a building where civilization is not the same of the village', async () => {
        Village.findByPk = jest.fn().mockResolvedValue({
            ...mockVillage,
            isAdminOrVillageOwner: jest.fn().mockResolvedValue(true)
        });

        BuildingService.getByName = jest.fn().mockResolvedValue({ 
            id: 1, 
            name: 'barrack', 
            is_common: false,
            getCivilization: jest.fn().mockResolvedValue({civilization_name: 'other_civilization'})
        });

        VillageBuildingService.createUniqueVillageBuildingWhenConstructionProgressIsFinished = jest.fn().mockResolvedValue(true);
        VillageBuildingService.updateUniqueVillageBuildingWhenConstructionProgressIsFinished = jest.fn().mockResolvedValue(true);
        Village_building.findOne = jest.fn().mockResolvedValue(null);

        const response = await request(app)
        .post('/api/village-construction-progress/new')
        .set('Authorization', `Bearer ${token}`)
        .send({
            village_id: 1,
            building_name: 'barrack'
        });

        expect(response.body).toEqual({error: 'Village civilization is not the same as the building civilization'});
        expect(response.statusCode).toBe(403);
    })

    it('[createNewBuilding] Should return 403 if user try to create a building who are already in construction', async () => {
        Village.findByPk = jest.fn().mockResolvedValue({
            ...mockVillage,
            isAdminOrVillageOwner: jest.fn().mockResolvedValue(true)
        });

        BuildingService.getByName = jest.fn().mockResolvedValue({ 
            id: 1, 
            name: 'barrack', 
            is_common: true
        });

        VillageBuildingService.createUniqueVillageBuildingWhenConstructionProgressIsFinished = jest.fn().mockResolvedValue(true);
        VillageBuildingService.updateUniqueVillageBuildingWhenConstructionProgressIsFinished = jest.fn().mockResolvedValue(true);
        Village_building.findOne = jest.fn().mockResolvedValue(null);
        Village_construction_progress.findOne = jest.fn().mockResolvedValue(true);

        const response = await request(app)
        .post('/api/village-construction-progress/new')
        .set('Authorization', `Bearer ${token}`)
        .send({
            village_id: 1,
            building_name: 'barrack'
        });

        expect(response.body).toEqual({error: 'Building construction already in progress'});
        expect(response.statusCode).toBe(403);
    })

    it('[createNewBuilding] Should return 404 if a user tries to create a building where the building level does not exist', async () => {
        Village.findByPk = jest.fn().mockResolvedValue({
            ...mockVillage,
            isAdminOrVillageOwner: jest.fn().mockResolvedValue(true)
        });

        BuildingService.getByName = jest.fn().mockResolvedValue({ 
            id: 1, 
            name: 'barrack', 
            is_common: true
        });

        VillageBuildingService.createUniqueVillageBuildingWhenConstructionProgressIsFinished = jest.fn().mockResolvedValue(true);
        VillageBuildingService.updateUniqueVillageBuildingWhenConstructionProgressIsFinished = jest.fn().mockResolvedValue(true);
        Village_building.findOne = jest.fn().mockResolvedValue(null);
        Village_construction_progress.findOne = jest.fn().mockResolvedValue(false);
        Building_level.findOne = jest.fn().mockResolvedValue(null);

        const response = await request(app)
        .post('/api/village-construction-progress/new')
        .set('Authorization', `Bearer ${token}`)
        .send({
            village_id: 1,
            building_name: 'barrack'
        });

        expect(response.body).toEqual({error: 'Building level not found'});
        expect(response.statusCode).toBe(404);
    })

    it('[createNewBuilding] Should return 500 if village construction progress is not created during the process', async () => {
        Village.findByPk = jest.fn().mockResolvedValue({
            ...mockVillage,
            isAdminOrVillageOwner: jest.fn().mockResolvedValue(true)
        });

        BuildingService.getByName = jest.fn().mockResolvedValue({ 
            id: 1, 
            name: 'barrack', 
            is_common: true
        });

        VillageBuildingService.createUniqueVillageBuildingWhenConstructionProgressIsFinished = jest.fn().mockResolvedValue(true);
        VillageBuildingService.updateUniqueVillageBuildingWhenConstructionProgressIsFinished = jest.fn().mockResolvedValue(true);
        Village_building.findOne = jest.fn().mockResolvedValue(null);
        Village_construction_progress.findOne = jest.fn().mockResolvedValue(false);
        Building_level.findOne = jest.fn().mockResolvedValue({ id: 1, level: 1 });
        BuildingCostService.checkAndUpdateResourcesBeforeCreate = jest.fn().mockResolvedValue(true);
        Village_construction_progress.create = jest.fn().mockResolvedValue(null);

        const response = await request(app)
        .post('/api/village-construction-progress/new')
        .set('Authorization', `Bearer ${token}`)
        .send({
            village_id: 1,
            building_name: 'barrack'
        });

        expect(response.body).toEqual({error: 'Village construction progress not created'});
        expect(response.statusCode).toBe(500);
    })

    afterEach(() => {
        jest.clearAllMocks();
    })
})