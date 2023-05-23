//import mongoose from 'mongoose';
const { connect, connection } = require('mongoose');

//created a connection to the database called 'usersDB'
const connectionString =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/usersDB';

connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//exported the connection
module.exports = connection;