const request = require('supertest');
const Resources = require('../users-model');
const db = require('../../database/dbConfig');
const server = require('../server');

describe('users model', () => {
  beforeEach(async () => {
    await db('users').truncate();
  });

  const user = {
    id: 1,
    username: 'register',
    password: 'lambda',
  };

  describe('add', () => {
    it('user is not empty', () => {
      expect(user).toMatchObject({
        username: expect.any(String),
      });
    });
    it('user is not null', () => {
      expect(user).not.toBeNull();
    });

    it('should add the provided user into the db', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({
          username: 'register',
          password: 'lambda',
        });
      const users = await db('users');
      expect(users).toHaveLength(1);
    });
  });
});