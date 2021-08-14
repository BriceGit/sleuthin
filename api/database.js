const mongoose = require('mongoose');
const db = mongoose.connection;
require('dotenv').config();

function initDB() {
  mongoose.connect(process.env.CONNECTION_STRING,
   {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })

  db.on('error', console.error.bind(console, 'connection error'));

  db.once('open', () => {
    console.log("Connected to database")
  })
}

module.exports = initDB;
