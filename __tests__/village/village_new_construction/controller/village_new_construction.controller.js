const request   = require('supertest'); 
const { app }   = require('../../../../server');
const jwt       = require('jsonwebtoken');
const config    = require('../../../../config');

describe('Village new construction Controller', () => {
    let token;

    beforeAll(() => {
        token = jwt.sign({ id: 1 }, config.jwtSecret);
    })

    it('should return 200 status code', async () => {
        const response = await request(app)
            .get('/api/village-new-construction')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
    })

    afterEach(() => {
        jest.clearAllMocks();
    })
})