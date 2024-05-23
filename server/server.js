require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;
const fs = require('fs');
const chokidar = require('chokidar');
const jwt = require('jsonwebtoken');

// Create API folder if it doesn't exist
const apiFolderPath = path.join(__dirname, 'api');
const viewsPath = path.join(__dirname, 'views');

app.use(cors({ origin: ["http://localhost:3000", "*"], credentials: true }));
// Connect to MongoDB
mongoose.set('strictQuery', false);
connectDB();

// Built-in middleware for parsing form data
app.use(express.urlencoded({ extended: false }));

// Built-in middleware for parsing JSON data
app.use(express.json());



// Built-in middleware for parsing cookies
app.use(cookieParser());
app.use(function authenticateToken(req, res, next) {

  console.log(req.method + ' ' + req.path)
  if (req.path.split('/')[2] === 'auth') return next()

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.json({ message: 'No token provided', status: false })
  jwt.verify(token, process.env.SALT, (err, user) => {
    if (err) return res.json({ message: 'Invalid token', status: false })
    console.log('Checked',req.method + ' ' + req.path)
    console.log(user)
    req.user = user
    req.user._id = user.user_id
    next()
  })
});

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// File-based routing
function registerRoutes(file) {
  const routeName = path.parse(file).name;
  const routePath = path.resolve(apiFolderPath, file);
  const routeModule = require(routePath);

  if (typeof routeModule === 'function') {
    const route = `/api/${routeName}`;
    app.use(route, routeModule);
    console.log(`Route created: ${route}`);
  } else {
    console.error(`Invalid route file: ${file}. Skipping...`);
  }
}

// Register initial routes
fs.readdirSync(apiFolderPath)
  .filter((file) => path.extname(file) === '.js')
  .forEach((file) => registerRoutes(file));
 
// Watch for changes in the api folder
chokidar.watch(apiFolderPath).on('add', (file) => {
  if (path.extname(file) === '.js') {
    registerRoutes(file);
  }
});

// Serve HTML file for root route
app.get('/', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    next(); // Let file-based routing handle the request
  } else {
    res.sendFile(path.join(viewsPath, 'index.html'));
  }
});

// Route handlers
app.all('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
