const Mongoose = require('mongoose');

require('dotenv').config();
const jwt = require("jsonwebtoken");


const {Schema, ObjectId, AuthenticationError, ValidationError} = require('mongoose');

const connect_db = async () => {
  try {
    await Mongoose.connect('mongodb://localhost:27017/sleuthin', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
      // Once the application has connected to the database, output success message
    console.log("Connected to the database.")
  }
  catch (err) {
    //output failure message id connection goes wrong
    console.log("Failure: could not connect to database.");
  }
}

const MysterySchema = new Schema({
  description: {type: String, required: true},
  clues:[
    {type: String}
  ],
  client: {type: String, required: true}
})

//Mongoose schema representing users
const UserSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
})

// Create Mysteries collection in database;
const Mysteries = new Mongoose.model('mysteries', MysterySchema);

//Create Users collection in database
const Users = new Mongoose.model('users', UserSchema);

const getUser = async (req) => {
  //if authorization header not sent in request return false
  if (!req.headers.authorization) return false;
  else {
    try {
      // check if the string sent in the header is a valid token

      let user = jwt.verify(req.headers.authorization, process.env.JWT_KEY);

      if (!user) return false;

      // check if the object encoded by the string has a userid hasOwnProperty
      // return false if not

      if (!user.hasOwnProperty('userid')) return false;

      // check userid in string against users in database
      let match = await Users.findById(user.userid);


      // return match if one is found
      if (match) return match._id;
    }
    //general purpose catch statement. Will add more specific error handling at a later date
    catch (e) {
      console.log(e.message)
    }
  }
}


exports.Mysteries = Mysteries;
exports.Users = Users;
exports.connect = connect_db;
exports.getUser = getUser;
