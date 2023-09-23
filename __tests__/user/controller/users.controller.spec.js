const request   = require('supertest'); // simule une requette http
const { app }   = require('../../../server');
const jwt       = require('jsonwebtoken');
const config    = require('../../../config');
const { User }  = require('../../../database/index').models;

describe('Test for users crud functuionality', () => {
    let token
    const mockId = 1

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

    const createdUser = {
        id: 1,
        username: 'test',
        email: 'test@test.fr'
    }

    const updatedUser = {
        id: 1,
        username: 'newusername',
        email: 'test@test.fr'
    }

    /**
     * Mocking sequelize methods
     */
    beforeEach(() => {   
        token = jwt.sign({id: mockId}, config.jwtSecret, {expiresIn: '7d'});
        User.findAll = jest.fn().mockResolvedValue(mockUsersList);
        User.findByPk = jest.fn().mockResolvedValue(mockUsersList[0]);
        User.create = jest.fn().mockResolvedValue(createdUser);
        User.findAndUpdate = jest.fn().mockResolvedValue(1);
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

    test('[get]request with id who doesn\'t match should return 404 and error message', async () => {
        User.findByPk = jest.fn().mockResolvedValue(null);
        const response = await request(app).get('/api/user/1').set('Authorization', `Bearer ${token}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toEqual('Utilisateur introuvable');
    })

    test('[get] request without valid id should return 400 code', async () => {
        const response = await request(app).get('/api/user/mauvaisid').set('Authorization', `Bearer ${token}`);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.errors.id.msg).toEqual('Invalid id type.');
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
        expect(response.body).toEqual(createdUser);
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
        expect(response.body.errors.username.msg).toEqual('Invalid value');
    })
    
    test('[create]request with empty body should return 400 with all errors messages', async () => {
        const response = await request(app).post('/api/user').set('Authorization', `Bearer ${token}`);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.errors.username.msg).toEqual('Invalid value');
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
    test('[update]request with valid body should return 204', async () => {
        const response = await request(app)
        .put('/api/user/1')
        .set('Authorization', `Bearer ${token}`)
        .send({username: 'newusername'})
        expect(response.statusCode).toBe(204);
    })

    test('[update]request with id who doesn\'t match should return 404 and error message', async () => {
        User.findAndUpdate = jest.fn().mockResolvedValue(0);
        const response = await request(app)
        .put('/api/user/1')
        .set('Authorization', `Bearer ${token}`)
        .send({username: 'newusername'})

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toEqual('User with primary key 1 not found or not modified');
    })

    test('[update]request with no id should return 404 and error message', async () => {
        const response = await request(app)
        .put('/api/user/')
        .set('Authorization', `Bearer ${token}`)
        .send({username: 'newusername'})

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toEqual("Ressource introuvable");
    })

    test('[update]request with string id should return 400 and error message', async () => {
        const response = await request(app)
        .put('/api/user/badid')
        .set('Authorization', `Bearer ${token}`)
        .send({username: 'newusername'})

        expect(response.statusCode).toBe(400);
        expect(response.body.errors.id.msg).toEqual('Invalid id type.');
    })

    test('[update]request with incorrect username should return 400 and error message', async () => {
        const response = await request(app)
        .put('/api/user/1')
        .set('Authorization', `Bearer ${token}`)
        .send({username: ''})

        expect(response.statusCode).toBe(400);
        expect(response.body.errors.username.msg).toEqual('Invalid value');
    })

    test('[update]request with incorrect username should return 400 and error message', async () => {
        const response = await request(app)
        .put('/api/user/1')
        .set('Authorization', `Bearer ${token}`)
        .send({username: ''})

        expect(response.statusCode).toBe(400);
        expect(response.body.errors.username.msg).toEqual('Invalid value');
    })

    test('[update]request with incorrect email should return 400 and error message', async () => {
        const response = await request(app)
        .put('/api/user/1')
        .set('Authorization', `Bearer ${token}`)
        .send({email: 'wrongemail'})

        expect(response.statusCode).toBe(400);
        expect(response.body.errors.email.msg).toEqual('L\'email est incorrect.');
    })

    test('[update]request with incorrect password should return 400 and error message', async () => {
        const response = await request(app)
        .put('/api/user/1')
        .set('Authorization', `Bearer ${token}`)
        .send({password: 'aaa'})

        expect(response.statusCode).toBe(400);
        expect(response.body.errors.password.msg).toEqual('Le mot de passe doit contenir entre 5 et 20 caractères');
    })

    test('[update]request with empty body should return 200 and message', async () => {
        const response = await request(app)
        .put('/api/user/1')
        .set('Authorization', `Bearer ${token}`)
        .send({})

        expect(response.statusCode).toBe(204);
    })

    test('[update]request without token should return 401', async () => {
        const response = await request(app).put('/api/user/1');

        expect(response.statusCode).toBe(401);
    })

    /**
     * Test for delete user
     */
    test('[delete] request with valid id should return 204', async () => {
        const user = new User();
        User.findByPk = jest.fn()
        .mockResolvedValueOnce(mockUsersList[0])
        .mockResolvedValueOnce(user)
        user.destroy = jest.fn().mockResolvedValue(1);

        const response = await request(app).delete('/api/user/1').set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(204);
    })

    test('[delete] request with invalid id should return 400', async () => {
        const response = await request(app).delete('/api/user/mauvaisid').set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(400);
        expect(response.body.errors.id.msg).toEqual('Invalid id type.');
    })

    test('[delete] request with no id should return 404', async () => {
        const response = await request(app).delete('/api/user/').set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toEqual('Ressource introuvable');
    })

    test('[delete] request with no token should return 401', async () => {
        const response = await request(app).delete('/api/user/1');

        expect(response.statusCode).toBe(401);
    })

    /**
     * me route
     */
    test('[me] request with valid token should return 200 and user', async () => {
        const response = await request(app).get('/api/user/me').set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockUsersList[0]);
    })

    test('[me] request with invalid jwt token id should return 500', async () => {
        User.findByPk = jest.fn().mockResolvedValue(null);
        const response = await request(app).get('/api/user/me').set('Authorization', `Bearer ${jwt.sign({id: 2}, config.jwtSecret, {expiresIn: '7d'})}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toEqual('Utilisateur introuvable');
    })

    test('[me] request with invalid token should return 401', async () => {
        const response = await request(app).get('/api/user/me');

        expect(response.statusCode).toBe(401);
    })
})