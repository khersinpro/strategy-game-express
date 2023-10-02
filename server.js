const express = require('express');
const NotFoundError = require('./errors/not-found');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const cors = require('cors');
const usersRouter = require('./api/user/user.router');
const roleRouter = require('./api/role/role.router');
const villageRouter = require('./api/village/village.router');
const serverRouter = require('./api/server/server.router');
const civilizationRouter = require('./api/civilization/civilization.router');
const unitRouter = require('./api/unit/unit.router');
const unitTypeRouter = require('./api/unit_type/unit_type.router');

const usersController = require('./api/user/user.controller');
const { auth } = require('./middlewares/auth');
const { loginSanitization } = require('./api/user/user.sanitization');


// Déclaratioon du serveur et configuration de socket.io
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
});

app.use((req, res, next) => {
    req.io = io;
    next();
})

app.use(cors());
app.use(express.json());

/**
 * Routes
 */
app.use('/api/user', auth, usersRouter);
app.use('/api/role', auth, roleRouter);
app.use('/api/village', auth, villageRouter);
app.use('/api/server', auth, serverRouter);
app.use('/api/civilization', auth, civilizationRouter);
app.use('/api/unit', auth, unitRouter);
app.use('/api/unit-type', auth, unitTypeRouter);
app.post('/api/login', loginSanitization, usersController.login)

app.use(express.static('public'));

/**
 * Middleware de gestion des erreurs 404
 */
app.use((req, res, next) => {
    next(new NotFoundError('Ressource introuvable'));
})

/**
 * Middleware de gestion d'erreur
 */
app.use((error, req, res, next) => {
    const status = error.status || 500;
    let message = error.message || 'Erreur interne au serveur';
    if (process.env.NODE_ENV === 'production')
    {
        message = 'Erreur interne au serveur';
    }
    res.status(status).json({ error: message });
})

module.exports = {
    app, server
};