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

const themes = {
  fruits: ["apple", "banana", "cherry", "date", "fig", "grape", "orange", "pear", "melon", "berry", "kiwi", "peach"],
  cars: ["sedan", "coupe", "convertible", "hatchback", "SUV", "truck", "van", "minivan", "jeep", "wagon", "roadster", "limousine"],
  animals: ["lion", "tiger", "bear", "elephant", "giraffe", "zebra", "kangaroo", "panda", "wolf", "fox", "rabbit", "deer"],
  countries: ["Canada", "Brazil", "France", "Germany", "Australia", "Japan", "India", "China", "Russia", "Italy", "Mexico", "Spain"],
  sports: ["soccer", "basketball", "baseball", "tennis", "cricket", "hockey", "golf", "boxing", "rugby", "swimming", "cycling", "skiing"],
  movies: ["Inception", "Titanic", "Avatar", "Gladiator", "Joker", "Interstellar", "Frozen", "Coco", "Up", "Braveheart", "Rocky", "Matrix"],
  colors: ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black", "white", "gray", "cyan"],
  cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville"],
  music: ["Rock", "Pop", "Jazz", "Classical", "Hip Hop", "Country", "Blues", "Reggae", "Metal", "Folk", "Disco", "Opera"],
  vegetables: ["carrot", "broccoli", "cauliflower", "spinach", "potato", "tomato", "onion", "lettuce", "pepper", "cucumber", "zucchini", "garlic"],
  planets: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Eris", "Haumea", "Makemake"],
  instruments: ["guitar", "piano", "violin", "drum", "flute", "trumpet", "saxophone", "cello", "clarinet", "trombone", "harp", "tuba"],
  elements: ["hydrogen", "helium", "lithium", "beryllium", "boron", "carbon", "nitrogen", "oxygen", "fluorine", "neon", "sodium", "magnesium"],
  flowers: ["rose", "tulip", "daisy", "sunflower", "orchid", "lily", "daffodil", "jasmine", "violet", "lavender", "peony", "chrysanthemum"],
  desserts: ["cake", "ice cream", "brownie", "pudding", "pie", "cookie", "donut", "muffin", "tart", "cheesecake", "eclair", "cupcake"],
  tools: ["hammer", "wrench", "screwdriver", "pliers", "drill", "saw", "chisel", "file", "level", "tape measure", "clamp"],
  furniture: ["chair", "table", "sofa", "bed", "dresser", "cabinet", "desk", "shelf", "stool", "bench", "wardrobe", "armchair"],
  beverages: ["coffee", "tea", "milk", "juice", "soda", "water", "wine", "beer", "smoothie", "lemonade", "cocktail", "champagne"],
  occupations: ["doctor", "teacher", "engineer", "nurse", "artist", "chef", "pilot", "lawyer", "plumber", "firefighter", "police", "scientist"],
  weather: ["rain", "snow", "sunny", "cloudy", "storm", "windy", "foggy", "hail", "thunder", "lightning", "tornado", "blizzard"],
  shapes: ["circle", "square", "triangle", "rectangle", "hexagon", "octagon", "oval", "star", "diamond", "pentagon", "heart", "crescent"],
  birds: ["sparrow", "eagle", "parrot", "pigeon", "owl", "flamingo", "peacock", "crow", "swan", "hawk", "penguin", "robin"],
  insects: ["butterfly", "ant", "bee", "beetle", "dragonfly", "mosquito", "spider", "ladybug", "grasshopper", "fly", "wasp", "caterpillar"],
  jewelry: ["necklace", "ring", "bracelet", "earring", "watch", "pendant", "brooch", "bangle", "anklet", "choker", "cufflink", "tiara"],
  trees: ["oak", "pine", "maple", "willow", "birch", "cedar", "spruce", "cherry", "apple", "walnut", "palm", "baobab"],
  historicalFigures: ["Einstein", "Cleopatra", "Gandhi", "Lincoln", "Napoleon", "Da Vinci", "Aristotle", "Shakespeare", "Newton", "Curie", "Columbus", "Mozart"],
  continents: ["Africa", "Asia", "Europe", "North America", "South America", "Australia", "Antarctica"],
  gemstones: ["diamond", "ruby", "sapphire", "emerald", "amethyst", "opal", "topaz", "turquoise", "garnet", "jade", "pearl", "aquamarine"],
  superheroes: ["Superman", "Batman", "Spiderman", "Ironman", "Wonder Woman", "Hulk", "Thor", "Captain America", "Flash", "Green Lantern", "Aquaman", "Black Panther"],
  mythicalCreatures: ["dragon", "unicorn", "phoenix", "griffin", "centaur", "mermaid", "vampire", "werewolf", "cyclops", "minotaur", "troll", "fairy"],
  hobbies: ["reading", "painting", "hiking", "knitting", "gardening", "fishing", "cooking", "cycling", "photography", "writing", "dancing", "drawing"],
  fairyTales: ["Cinderella", "Snow White", "Sleeping Beauty", "Little Red Riding Hood", "Hansel and Gretel", "Jack and the Beanstalk", "Beauty and the Beast", "Rapunzel", "The Little Mermaid", "Aladdin", "Pinocchio", "Peter Pan"],
  professions: ["doctor", "teacher", "engineer", "nurse", "artist", "chef", "pilot", "lawyer", "plumber", "firefighter", "police", "scientist"],
  kitchenAppliances: ["oven", "microwave", "blender", "toaster", "refrigerator", "dishwasher", "mixer", "grill", "freezer", "coffee maker", "stove", "kettle"],
  boardGames: ["Monopoly", "Chess", "Checkers", "Scrabble", "Clue", "Risk", "Catan", "Candy Land", "Sorry", "Life", "Battleship", "Jenga"],
  modesOfTransport: ["bicycle", "car", "bus", "train", "airplane", "boat", "scooter", "motorcycle", "tram", "subway", "helicopter", "ferry"],
  mythicalGods: ["Zeus", "Hera", "Odin", "Thor", "Poseidon", "Athena", "Ares", "Apollo", "Hades", "Loki", "Hermes", "Dionysus"],
  danceStyles: ["ballet", "jazz", "tap", "hip hop", "salsa", "tango", "waltz", "breakdance", "flamenco", "swing", "contemporary", "folk"],
  spaceObjects: ["star", "planet", "comet", "asteroid", "meteor", "nebula", "galaxy", "black hole", "moon", "quasar", "supernova", "pulsar"],
  seaCreatures: ["shark", "dolphin", "whale", "octopus", "jellyfish", "starfish", "seahorse", "crab", "lobster", "shrimp", "seal", "sea turtle"],
  materials: ["wood", "metal", "plastic", "glass", "ceramic", "cloth", "paper", "rubber", "leather", "stone", "concrete", "fabric"],
  famousLandmarks: ["Eiffel Tower", "Great Wall", "Statue of Liberty", "Colosseum", "Taj Mahal", "Machu Picchu", "Pyramids", "Big Ben", "Sydney Opera House", "Mount Rushmore", "Christ the Redeemer", "Stonehenge"]
};

const lobbies = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('createLobby', (username) => {
    const lobbyCode = uuidv4();
    lobbies[lobbyCode] = { players: [{ id: socket.id, name: username }] };
    socket.join(lobbyCode);
    socket.emit('lobbyCreated', lobbyCode);
    io.to(lobbyCode).emit('updatePlayers', lobbies[lobbyCode].players);
  });

  socket.on('joinLobby', (lobbyCode, username) => {
    if (lobbies[lobbyCode]) {
      lobbies[lobbyCode].players.push({ id: socket.id, name: username });
      socket.join(lobbyCode);
      io.to(lobbyCode).emit('updatePlayers', lobbies[lobbyCode].players);
    } else {
      socket.emit('error', 'Lobby does not exist');
    }
  });

  socket.on('startGame', (lobbyCode) => {
    if (lobbies[lobbyCode]) {
      const players = lobbies[lobbyCode].players;
      const roles = assignRoles(players);
      const [randomTheme, words] = getRandomThemeAndWords();
      const board = createBoard(words);

      players.forEach(player => {
        io.to(player.id).emit('gameStarted', { role: roles[player.id], board, theme: randomTheme, word: getRandomWord(words) });
      });

      io.to(lobbyCode).emit('gameStarted', { board, theme: randomTheme });
    }
  });

  socket.on('disconnect', () => {
    for (const lobbyCode in lobbies) {
      const index = lobbies[lobbyCode].players.findIndex(player => player.id === socket.id);
      if (index !== -1) {
        lobbies[lobbyCode].players.splice(index, 1);
        io.to(lobbyCode).emit('updatePlayers', lobbies[lobbyCode].players);
        if (lobbies[lobbyCode].players.length === 0) {
          delete lobbies[lobbyCode];
        }
        break;
      }
    }
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
    acc[players[index].id] = role;
    return acc;
  }, {});
}

function createBoard(themeWords) {
  const shuffledWords = themeWords.sort(() => Math.random() - 0.5);
  return Array.from({ length: 4 }, (_, rowIndex) => shuffledWords.slice(rowIndex * 4, (rowIndex + 1) * 4));
}

function getRandomThemeAndWords() {
  const entries = Object.entries(themes);
  const [randomTheme, words] = entries[Math.floor(Math.random() * entries.length)];
  return [randomTheme, words];
}

function getRandomWord(words) {
  return words[Math.floor(Math.random() * words.length)];
}