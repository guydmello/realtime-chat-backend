const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'https://realtime-chat-frontend-3fow.onrender.com', // Replace with your actual frontend URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'https://realtime-chat-frontend-3fow.onrender.com', // Replace with your actual frontend URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(5000, () => {
  console.log('listening on *:5000');
});
