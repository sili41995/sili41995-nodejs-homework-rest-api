const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { login } = require('./users');
const cors = require('cors');
const getExpectData = require('../utils/getExpectData');
require('dotenv').config();

const app = express();
let server;
app.use(cors());
app.use(express.json());

app.post('/api/users/login', login);

describe('test login controller', () => {
  beforeAll(() => {
    mongoose.connect(process.env.DB_HOST).then(() => {
      server = app.listen(3000);
    });
  });

  afterAll(() => {
    mongoose.disconnect().then(() => {
      server.close();
    });
  });

  test('POST /api/users/login', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ password: '12345678', email: 'sil111@gmail.com' });
    const { isObject, isValidLength, isString } = getExpectData(response);
    expect(response.status).toBe(200);
    expect(typeof response.body.token).toBe('string');
    expect(isObject && isValidLength && isString).toBe(true);
  });
});
