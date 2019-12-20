const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const knexConnection = require('../database/dbConfig');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();

const sessionOptions = {
  name: 'Melody',
  secret: process.env.COOKIE_SECRET || 'Melbell94',
  cookie: {
    secure: process.env.COOKIE_SECURE || false,
    maxAge: 1000 * 60 * 60 * 30,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: knexConnection,
    createtable: true,
    clearInterval: 1000 * 60 * 40,
  }),
};

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use(session(sessionOptions));

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

server.get('/', (req, res) => {
  res.json({ api: 'API up and running', session: req.session });
});

module.exports = server;
