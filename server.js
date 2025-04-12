require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'pharmacy-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Database
const db = require('./models');
const initializeDatabase = require('./models/db.init');

// Make user info available to all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.userType = req.session.userType || null;
  next();
});

// Simple test route
app.get('/', (req, res) => {
  res.render('index', { title: 'Pharmacy Drug Management System' });
});

// Import routes
require('./routes/auth.routes')(app);
require('./routes/customer.routes')(app);
require('./routes/seller.routes')(app);
require('./routes/product.routes')(app);
require('./routes/inventory.routes')(app);
require('./routes/order.routes')(app);

// Initialize database
initializeDatabase()
  .then(() => {
    console.log("Database initialization complete");
  })
  .catch((err) => {
    console.error("Error initializing database:", err);
  });

// Set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log('http://localhost:3000');
});