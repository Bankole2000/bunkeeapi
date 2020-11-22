express = require('express');
http = require('http');

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

var position = {
  x: 200,
  y: 200,
};

io.on('connection', (socket) => {
  console.log('Connected!');
  // socket.emit('position', position);
});

server.listen(3000);
