const express = require('express');
const NotFoundError = require('./errors/not-found');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const cors = require('cors');
const usersRouter = require('./api/user/user.router');
const roleRouter = require('./api/role/role.router');
const usersController = require('./api/user/user.controller');
const authMiddleware = require('./middlewares/auth');
const { loginSanitization } = require('./api/user/user.sanitization');


// Déclaratioon du serveur et configuration de socket.io
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    // socket.on('message', (message) => {
    //     console.log('message: ' + message);
    // });
    // socket.emit('message', 'Hello from server');
});

app.use((req, res, next) => {
    req.io = io;
    next();
})

app.use(cors());
app.use(express.json());

app.use('/api/user', authMiddleware, usersRouter);
app.use('/api/role', authMiddleware, roleRouter);
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