const express       = require('express');
const NotFoundError = require('./errors/not-found');
const http          = require('http');
const { Server }    = require('socket.io');
const app           = express();
const cors          = require('cors');
const apiRouter     = require('./router/api.router');

// Server declaration and socket.io configuration
const server = http.createServer(app);
const io     = new Server(server);

io.on('connection', (socket) => { });

app.use((req, res, next) => {
    req.io = io;
    next();
})

app.use(cors());
app.use(express.json());

// API router
app.use(apiRouter);

app.use(express.static('public'));

/**
 * Error management middleware 404
 */
app.use((req, res, next) => {
    next(new NotFoundError('Ressource introuvable'));
})

/**
 * Error middleware for all errors
 */
app.use((error, req, res, next) => {
    const status = error.status || 500;
    let message = error.message || 'Internal server error';
    if (process.env.NODE_ENV === 'production')
    {
        message = 'Internal server error';
    }
    res.status(status).json({ error: message });
})

module.exports = {
    app, server
};