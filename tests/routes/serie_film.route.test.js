const request = require('supertest');
const app = require('../../index');

//test la route /film
describe('Test the root path', () => {
  test('It should response the GET method', (done) => {
    request(app).get('/seriefilm/film').then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});

//test la route /film/categories
describe('Test the root path', () => {
    test('It should response the GET method', (done) => {
      request(app).get('/seriefilm/film/categories').then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
});

//test la route serie
describe('Test the root path', () => {
    test('It should response the GET method', (done) => {
      request(app).get('/seriefilm/serie').then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
});

//test la route /film/categories
describe('Test the root path', () => {
    test('It should response the GET method', (done) => {
      request(app).get('/seriefilm/serie/categories').then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
});