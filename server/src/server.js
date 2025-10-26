const http = require('http');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { sequelize } = require('./db');
const routes = require('./routes');
const { Server } = require('socket.io');

const app = express();
app.use(cors({ origin: process.env.WEB_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.WEB_ORIGIN || 'http://localhost:5173' } });
app.set('io', io);

io.on('connection', socket => {
  socket.on('join:project', projectId => {
    if (projectId) socket.join(projectId);
  });
  socket.on('leave:project', projectId => {
    if (projectId) socket.leave(projectId);
  });
});

app.use('/api', routes);

const port = process.env.PORT || 4000;

sequelize.sync().then(() => {
  server.listen(port, () => {
    console.log('server on', port);
  });
});