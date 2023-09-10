const request   = require('supertest'); // simule une requette http
const {app}     = require('../../server');
const jwt       = require('jsonwebtoken');
const config    = require('../../config');
const { User }  = require('../../database/index').models;

describe('Test for users crud functuionality', () => {
    let token
    const mockId = 1

    const mockUsersList = [
        {
            id: 1,
            username: 'test',
            email: 'test@test.fr'
        },
        {
            id: 2,
            username: 'test2',
            email: 'test2@test2.fr'
        }
    ]

    const createdUser = {
        id: 1,
        username: 'test',
        email: 'test@test.fr'
    }


    beforeEach(() => {   
        token = jwt.sign({id: mockId}, config.jwtSecret, {expiresIn: '7d'});
        User.findAll = jest.fn().mockResolvedValue(mockUsersList);
        User.findByPk = jest.fn().mockResolvedValue(mockUsersList[0]);
        User.create = jest.fn().mockResolvedValue(createdUser);
    })
    
    /**
     * Test for getAll users
     */
    test('[GetAll] should return all users', async () => {
        const response = await request(app).get('/api/user').set('Authorization', `Bearer ${token}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockUsersList);
        expect(response.body.length).toBe(2);
    })

    test('[GetAll] request without token should return 401', async () => {
        const response = await request(app).get('/api/user');
        
        expect(response.statusCode).toBe(401);
    })

    /**
     * Test for get user
     */
    test('[get] should return 200 code and one user', async () => {
        const response = await request(app).get('/api/user/1').set('Authorization', `Bearer ${token}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockUsersList[0]);
    })

    test('[get] request without valid id should return 400 code', async () => {
        const response = await request(app).get('/api/user/mauvaisid').set('Authorization', `Bearer ${token}`);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toEqual('Id invalide');
    })

    test('[get]request without token should return 401', async () => {
        const response = await request(app).get('/api/user/1');
        
        expect(response.statusCode).toBe(401);
    })

    /**
     * Test for create user
     */ 
    test('[create]request with valid body should return 201 and one user', async () => {
        const response = await request(app)
        .post('/api/user')
        .set('Authorization', `Bearer ${token}`)
        .send({username: 'test', email: 'test@test.fr', password: 'passwordlong'});
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(mockUsersList[0]);
    })

    test('[create]request with short password should return 400 with password error message', async () => {
        const response = await request(app)
        .post('/api/user')
        .set('Authorization', `Bearer ${token}`)
        .send({username: 'test', email: 'test@test.fr', password: 'test'});
        
        expect(response.statusCode).toBe(400);
        expect(response.body.errors.password.msg).toEqual('Le mot de passe doit contenir entre 5 et 20 caractères');
    })
    
    test('[create] request with invalid email should return 400 with email error message', async () => {
        const response = await request(app)
        .post('/api/user')
        .set('Authorization', `Bearer ${token}`)
        .send({username: 'test', email: 'testtest.fr', password: 'testtesttest'});
        
        expect(response.statusCode).toBe(400);
        expect(response.body.errors.email.msg).toEqual('L\'email est incorrect.');
    })

    test('[create] request with invalid username should return 400 with username error message', async () => {
        const response = await request(app)
        .post('/api/user')
        .set('Authorization', `Bearer ${token}`)
        .send({username: '', email: 'testtest.fr', password: 'testtesttest'});
        
        expect(response.statusCode).toBe(400);
        expect(response.body.errors.username.msg).toEqual('Le nom d\'utilisateur doit faire entre 3 et 30 caractères.');
    })
    
    test('[create]request with empty body should return 400 with all errors messages', async () => {
        const response = await request(app).post('/api/user').set('Authorization', `Bearer ${token}`);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.errors.username.msg).toEqual('Le nom d\'utilisateur doit faire entre 3 et 30 caractères.');
        expect(response.body.errors.email.msg).toEqual('L\'email est incorrect.');
        expect(response.body.errors.password.msg).toEqual('Le mot de passe doit contenir entre 5 et 20 caractères');
    })
    
    test('[create]request without token should return 401', async () => {
        const response = await request(app).post('/api/user');
        
        expect(response.statusCode).toBe(401);
    })

    /**
     * Test for update user
     */

})