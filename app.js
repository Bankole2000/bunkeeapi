const express = require('express');
const morgan = require('morgan');
const http = require('http');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const bodyParser = require('body-parser');
const { config } = require('./config/setup');
const db = require('./config/database.js');
const app = express();
const server = http.createServer(app);
const { userMethods } = require('./utils/socketUtils');

const io = require('socket.io')(server, {
  cors: {
    origin: `${config.appUrl}`,
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log(`Socket Connected! ${socket.id}`);
  // socket.emit('position', position);
  // socket.on('like', (data) => {
  //   console.log(data);
  //   io.sockets.emit('like', data);
  // });
  // socket.on('chatMessage', (data) => {
  //   console.log(data);
  //   socket.emit('chatMessage', data);
  // });
  socket.on('login', async (data) => {
    console.log('user logged In', { user: data.user.id });
    const updatedUser = await userMethods.updateLoggedInStatus(
      data.user.id,
      true,
      socket.id
    );
    console.log({ updatedUser: updatedUser.dataValues });
    io.emit('newLogin', updatedUser);
  });
  socket.on('logout', async (user) => {
    console.log(user);
    const updatedUser = await userMethods.updateLoggedInStatus(user.id, false);
    console.log(`${user.username} logged out`);
    io.emit('userLogout', updatedUser);
  });
  socket.on('typing', (data) => {
    console.log(data);
    io.to(data.socketId).emit('isTyping', data);
  });
  socket.on('chatMessage', (data) => {
    console.log(data);
    io.to(data.chattee.currentSocketId).emit('chatMessage', data.message);
  });
  socket.on('pingMessage', (data) => {
    console.log(data);
    io.to(data.chattee.currentSocketId).emit(
      'pingMessage',
      data.data.pingMessage
    );
  });
  socket.on('allRead', (data) => {
    userMethods.allChatRead(
      data.contactId,
      data.senderId,
      data.hasBeenDelivered,
      data.hasBeenRead
    );
    console.log(data);
    io.to(data.socketId).emit('allRead', data);
  });
  socket.on('deleteContact', (data) => {
    console.table(data);
    io.to(data.socketId).emit('deleteContact', data);
  });
  socket.on('disconnect', async () => {
    console.log('socket Disconnected', socket.id);
    const updatedUser = await userMethods.updateUserSocketDisconnected(
      socket.id
    );
    if (updatedUser) {
      io.emit('userLogout', updatedUser);
    }
  });
});

server.listen(3000);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// CORS stuff
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// Test db connection
db.authenticate()
  .then(() => {
    // db.sync({ alter: true });
    console.log('Database Connected...');
    console.log(db.models);
    app.listen(config.port, () => {
      console.log(`Server listening on port - ${config.port}`);
    });
  })
  .catch((err) => console.log(`err => ${err}`));

// Routes
// const testRoutes = require('./api/routes/testRoutes')(app, io);
const userRoutes = require('./api/routes/userRoutes');
const rentalRoutes = require('./api/routes/rentalRoutes');
const offerRoutes = require('./api/routes/offerRoutes');
const listingRoutes = require('./api/routes/listingRoutes');
const bookingRoutes = require('./api/routes/bookingRoutes');
const singleUserRoutes = require('./api/routes/singleUserRoutes');
const chatRoutes = require('./api/routes/chatRoutes');
const notificationRoutes = require('./api/routes/notificationRoutes');

const { watch } = require('fs');

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Bunkee api' });
});

app.use('/users', userRoutes);
app.use('/user', singleUserRoutes);
app.use('/bookings', bookingRoutes);
app.use('/listings', listingRoutes);
app.use('/offers', offerRoutes);
app.use('/rentals', rentalRoutes);
app.use('/chat', chatRoutes);
app.use('/notifications', notificationRoutes);
// app.post('/listingImage', upload.single('listingImage'), (req, res, next) => {
//   console.log(req.file);
//   res.status(200).json({ message: 'uploaded file' });
// });

// app.use((req, res, next) => {
//   res.status(200).json({
//     message: `This route doesn't exist - here's some helpful tips`,
//   });
// });
