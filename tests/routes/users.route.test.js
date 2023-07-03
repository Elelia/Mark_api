const request = require('supertest');
const app = require('../../index');

//test la route /
describe('Test the root path', () => {
    test('It should response the GET method', (done) => {
      request(app).get('/users/').then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
});

//test la route /auth/login
//a voir comment ça fonctionne pour les routes post
describe('Test the root path', () => {
    test('It should response the POST method', (done) => {
      request(app).post('/users/auth/login').then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
});