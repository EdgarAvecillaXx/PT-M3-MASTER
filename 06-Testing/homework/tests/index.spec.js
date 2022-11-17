const session = require('supertest-session');
const app = require('../index.js'); // Importo el archivo de entrada del server de express.

const agent = session(app);

describe('Test de APIS', () => {
  describe('GET /', () => {
    it('responds with 200', () => agent.get('/').expect(200));
    it('responds with and object with message `hola`', () =>
        agent.get('/').then((res) => {
          expect(res.body.message).toEqual('hola');
        }));
  });

  describe('GET /test', () => {
    it('responds with 200', () => agent.get('/test').expect(200));
    it('responds with and object with message `test`', () =>
      agent.get('/test').then(res => {
        expect(res.body.message).toEqual('test');
      }));
  });

  describe('POST /sum', () => {
    it('responds with 200', () => agent.post('/sum').send({ a: 2, b: 1 }).expect(200));
    it('responds with 400', () => agent.post('/sum').send({ a: 2, b: 'ffdfsfsdf' }).expect(400));
    it('responds with 400', () => agent.post('/sum').send().expect(400));
    it('responds with the sum of 2 and 3', () =>
      agent
        .post('/sum')
        .send({ a: 2, b: 3 })
        .then(res => {
          expect(res.body.result).toEqual(5);
        }));
    it('resonds with the sum of -5 and 7', () => {
      agent
        .post('/sum')
        .send({ a: -5, b: 7 })
        .then(res => {
          expect(res.body.result).toEqual(2);
        });
    });
  });

  describe('POST /producto', () => {
    it('responds with 200', () => agent.post('/product').send({ a: 2, b: 1 }).expect(200));
    it('responds with 400', () => agent.post('/product').send({ a: 2, b: 'ffdfsfsdf' }).expect(400));
    it('responds with 400', () => agent.post('/product').expect(400));
    it('responds with the product of 2 and 3', () =>
      agent
        .post('/product')
        .send({ a: 2, b: 3 })
        .then(res => {
          expect(res.body.result).toEqual(6);
        }));
    it('responds with the product of -2 and 3', () =>
      agent
        .post('/product')
        .send({ a: -2, b: 3 })
        .then(res => {
          expect(res.body.result).toEqual(-6);
        }));
  });

  describe('POST /sumArray', () => {
    it('responds with 400', () => agent.post('/sumArray').expect(400));
    it('responds with 200', () => agent.post('/sumArray').send({ array: [], num: 0 }).expect(200));
    it('should respond with true if the combination of two numbers matches num', () =>
      agent
        .post('/sumArray')
        .send({ array: [2, 5, 7, 10, 11, 15, 20], num: 13 })
        .then(res => {
          expect(res.body.result).toEqual(true);
        }));
    it('Should respond with false if no combination of two numbers matches num', () =>
      agent
        .post('/sumArray')
        .send({ array: [2, 5, 7, 10, 11, 15, 20], num: 23 })
        .then(res => {
          expect(res.body.result).toEqual(false);
        }));
  });

  describe('POST /numString', () => {
    it('responds with 200', () => agent.post('/numString').send({ string: ' ' }).expect(200));
    it('responds with 400', () => agent.post('/numString').send({ string: 4 }).expect(400));
    it('responds with 400', () => agent.post('/numString').send({ string: '' }).expect(400));
    it('responds with a 4 if we send "hola"', () =>
      agent
        .post('/numString')
        .send({ string: 'hola' })
        .then(res => {
          expect(res.body.result).toEqual(4);
        }));
  });

  describe('POST /pluck', () => {
    it('responds with 200', () => agent.post('/pluck').send({ array: [], prop: 'prop' }).expect(200));
    it('responds 400', () => agent.post('/pluck').send({ array: {}, prop: 'string' }).expect(400));
    it('responds 400', () => agent.post('/pluck').send({ array: [], prop: '' }).expect(400));
    it('responds with an array of objects thath has that property', () =>
      agent
        .post('/pluck')
        .send({
          array: [
            { nombre: 'Edgar', escuela: 'Henry', lenguage: 'NodeJS' },
            { nombre: 'Joel', escuela: 'Henry', lenguage: 'Angular' },
            { nombre: 'Ivanna', escuela: 'Henry', lenguage: 'NodeJS' },
            { nombre: 'Batman', escuela: 'Gotica', lenguage: 'React' },
          ],
          prop: 'Henry',
        })
        .then(res => {
          expect(res.body.result).toEqual([
            { nombre: 'Edgar', escuela: 'Henry', lenguage: 'NodeJS' },
            { nombre: 'Joel', escuela: 'Henry', lenguage: 'Angular' },
            { nombre: 'Ivanna', escuela: 'Henry', lenguage: 'NodeJS' },
          ]);
        }));
    it('responds with an array of objects thath has that property', () =>
      agent
        .post('/pluck')
        .send({
          array: [
            { nombre: 'Edgar', escuela: 'Henry', lenguage: 'NodeJS' },
            { nombre: 'Joel', escuela: 'Henry', lenguage: 'Angular' },
            { nombre: 'Ivanna', escuela: 'Henry', lenguage: 'NodeJS' },
            { nombre: 'Batman', escuela: 'Gotica', lenguage: 'React' },
          ],
          prop: 'Coderhouse',
        })
        .then(res => {
          expect(res.body.result).toEqual([]);
        }));
  });


});

