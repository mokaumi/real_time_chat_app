const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const moment = require('moment'); // For time formatting

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', socket => {
  let username = '';
  let room = '';

  socket.on('join room', ({ name, roomName }) => {
    username = name;
    room = roomName;
    socket.join(room);
    io.to(room).emit('chat message', {
      user: 'System',
      text: `${username} joined the room.`,
      time: moment().format('HH:mm:ss')
    });
  });

  socket.on('chat message', (msg) => {
    if (room) {
      io.to(room).emit('chat message', {
        user: username,
        text: msg,
        time: moment().format('HH:mm:ss')
      });
    }
  });

  socket.on('disconnect', () => {
    if (username && room) {
      io.to(room).emit('chat message', {
        user: 'System',
        text: `${username} left the room.`,
        time: moment().format('HH:mm:ss')
      });
    }
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
