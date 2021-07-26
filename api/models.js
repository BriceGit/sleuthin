let mongoose = require('mongoose');

const MysterySchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  clues:[
    {type: String}
  ],
  user: {type: String, required: true}
})

//Mongoose schema representing users
const UserSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
})

// Create Mysteries collection in database. Type omitted in order to make global scoped
Mysteries = new mongoose.model('Mysteries', MysterySchema);

//Create Users collection in database. Type omitted in order to make global scoped
Users = new mongoose.model('Users', UserSchema);

exports.Mysteries = Mysteries;

exports.Users = Users;
