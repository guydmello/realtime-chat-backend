const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

const lobbies = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('createLobby', () => {
    const lobbyCode = uuidv4();
    lobbies[lobbyCode] = { players: [] };
    socket.join(lobbyCode);
    socket.emit('lobbyCreated', lobbyCode);
  });

  socket.on('joinLobby', (lobbyCode) => {
    if (lobbies[lobbyCode]) {
      socket.join(lobbyCode);
      lobbies[lobbyCode].players.push(socket.id);
      io.to(lobbyCode).emit('updatePlayers', lobbies[lobbyCode].players);
    } else {
      socket.emit('error', 'Lobby does not exist');
    }
  });

  socket.on('startGame', (lobbyCode) => {
    if (lobbies[lobbyCode]) {
      const players = lobbies[lobbyCode].players;
      const roles = assignRoles(players);
      io.to(lobbyCode).emit('gameStarted', roles, createBoard(themeWords));
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(5000, () => {
  console.log('listening on *:5000');
});

function assignRoles(players) {
  const numMoles = Math.floor(Math.random() * 2) + 1;
  const roles = Array(numMoles).fill("mole").concat(Array(players.length - numMoles).fill("detective"));
  return roles.sort(() => Math.random() - 0.5).reduce((acc, role, index) => {
    acc[players[index]] = role;
    return acc;
  }, {});
}

function createBoard(themeWords) {
  const shuffledWords = themeWords.sort(() => Math.random() - 0.5);
  return Array.from({ length: 4 }, (_, rowIndex) => shuffledWords.slice(rowIndex * 4, (rowIndex + 1) * 4));
}
