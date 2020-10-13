const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const multer = require('multer');
const { config } = require('./config/setup');
const db = require('./config/database.js');

const upload = multer();
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.array());

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
    db.sync({ force: true });
    console.log('Database Connected...');
    console.log(db.models);
    app.listen(config.port, () => {
      console.log(`Server listening on port - ${config.port}`);
    });
  })
  .catch((err) => console.log(`err => ${err}`));

// Routes
const userRoutes = require('./api/routes/userRoutes');
const rentalRoutes = require('./api/routes/rentalRoutes');
const offerRoutes = require('./api/routes/offerRoutes');
const listingRoutes = require('./api/routes/listingRoutes');
const bookingRoutes = require('./api/routes/bookingRoutes');

app.get('/', (req, res) => res.json({ message: 'Welcome to the Bunkee api' }));
app.use('/users', userRoutes);
app.use('/bookings', bookingRoutes);
app.use('/listings', listingRoutes);
app.use('/offers', offerRoutes);
app.use('/rentals', rentalRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    message: `This route doesn't exist - here's some helpful tips`,
  });
});
