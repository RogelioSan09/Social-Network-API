// Set up for use of Express.js, requires the installation of the express package 
// Sets up the connection to the database and starts the server.
// Requires the created routes folder.
const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

// Get the current working directory
const cwd = process.cwd();

// Set up port and initialize the app
const PORT = process.env.PORT || 3001;
const app = express();

// Get the activity name from the current working directory
const activity = cwd.includes('01-Activities')
  ? cwd.split('/01-Activities/')[1]
  : cwd;

// Set up the middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

// Connect to the database and run the server
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server for ${activity} running on port ${PORT}!`);
  });
});