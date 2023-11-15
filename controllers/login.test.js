const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { login } = require('./users');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/users/login', login);

describe('test login controller', () => {
  beforeAll(() => {
    mongoose.connect(process.env.DB_HOST).then(() => {
      app.listen(3000);
    });
  });

  test('POST /api/users/login', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ password: '12345678', email: 'sil111@gmail.com' });
    expect(response.status).toBe(200);
    expect(typeof response.body.token).toBe('string');
    const isObject = typeof response.body.user === 'object';
    const keys = Object.keys(response.body.user);
    const isValidLength = keys.length === 2;
    const isString = typeof keys[0] === 'string' && typeof keys[1] === 'string';
    expect(isObject && isValidLength && isString).toBe(true);
  });
});
