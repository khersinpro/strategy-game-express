const request = require('supertest'); // simule une requette http
const {app} = require('../server');
const jwt = require('jsonwebtoken');
const config = require('../config');
const mongoose = require('mongoose');
const mockingoose = require('mockingoose');
const User = require('../api/users/users.model');
const usersService = require('../api/users/users.service');

describe('tester l\'api users', () => {
    const USER_ID = 'fake';
    const MOCK_DATA = [
        {
            _id: USER_ID,
            name: 'ana',
            email: 'email@email.com',
            password: 'password'
        }
    ];
    const MOCK_USER_CREATED = {
        name: 'ana',
        email: 'email@email.fr',
        password: 'password'
    };
    let token;


    beforeEach(() => {
        token = jwt.sign({userId: USER_ID}, config.jwtSecret);
        // EXEMPLE de mock de la fonction find de mongoose avec jest
        // mongoose.Query.prototype.find = jest.fn().mockResolvedValue(MOCK_DATA);
        mockingoose(User).toReturn(MOCK_DATA, 'find');
        mockingoose(User).toReturn(MOCK_USER_CREATED, 'save');
    });

    test('[Users] Get all', async () => {
        // Simulation d'un requte http avec token
        const res = await request(app)
        .get('/api/users')
        .set('x-access-token', token);

        // controle que le status est bien 200
        expect(res.status).toBe(200); 

        // controle que la taille du tableau est supérieur à 0
        expect(res.body.length).toBeGreaterThan(0); 
    })

    test('[Users] Create User', async () => {
        const res = await request(app)
        .post('/api/users')
        .send(MOCK_USER_CREATED)
        .set('x-access-token', token);

        expect(res.status).toBe(201);
        expect(res.body.name).toBe(MOCK_USER_CREATED.name);
    })

    test('Est ce que userService.getAll a été appelé', async () => {
        // Créer un espion sur la fonction getAll de usersService
        const spy = jest.spyOn(usersService, 'getAll');
        await request(app)
        .get('/api/users')
        .set('x-access-token', token);

        expect(spy).toHaveBeenCalled(); // controle que la fonction a été appelé
        expect(spy).toHaveBeenCalledTimes(1); // controle que la fonction a été appelé 1 fois
    })

    afterEach(() => {
        jest.clearAllMocks();
    })
});