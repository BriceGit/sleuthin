//BUSINESS LOGIC LAYER implementation

"use strict"

let mongoose = require('mongoose');

const { AuthenticationError, ForbiddenError} = require('apollo-server-express');

//Mongoose collections
const {User, Case, Clue, Comment} = require('./models');

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const authenticateToken = async(token) => {

  if(!token) throw new AuthenticationError("not signed in")

  let userIdObject = await jwt.verify(token, 'secret');
  let returnedUser  = await User.findById(userIdObject.userId);

  if (!returnedUser) throw new AuthenticationError("invalid identity");

  return returnedUser;
};

const signIn = async (username, password) => {
  //find user document associated with username
  let returnedUser = await User.findOne({username: username});

  //if no user object is not returned throw an AuthenticationError
  if (!returnedUser) throw new AuthenticationError('incorrect username or password');

  //check if the returnedUser's hashed password matches the submitted plaintext password

  let passwordMatched = await bcrypt.compare(password, returnedUser.password);

  //if the password doesnt match throw an authentication error
  if (!passwordMatched) throw new AuthenticationError('incorrect username or password');

  //return token containing the encrypted user id;
  return jwt.sign({userId: returnedUser._id}, 'secret');

};

const postCase = async (inputCase, token) => {

  let user = await authenticateToken(token);

  let newCase = {
    client: user._id,
    title: inputCase.title,
    description: inputCase.description,
    clues: inputCase.clues,
    solved: false
  }

  return await Case.create(newCase);
};


const deleteCase = async (parent, args, token) => {
  let user = authenticateToken(token);

  let matchedCase = await Case.findById({_id: args.caseid});

  if (!matchedCase) return
};

const toggleWorkOnCase = async (caseid, token) => {
  let user = await authenticateToken(token);

  if (user.casesWorkingOn.includes(mongoose.Types.ObjectId(caseid))) {
    user.casesWorkingOn = user.casesWorkingOn.filter((x) =>  {
      return ( String(x) !== caseid);
    })
  }
  else {
    user.casesWorkingOn.push(mongoose.Types.ObjectId(caseid));
  }

  await User.updateOne({_id: user._id}, { $set: {casesWorkingOn: user.casesWorkingOn}});

  return user.casesWorkingOn;
};

const setCaseSolved = async (parent, args, token) => {

};

const postComment = async (parent, args, token) => {

};



exports.signIn = signIn;
exports.postCase = postCase;
exports.toggleWorkOnCase = toggleWorkOnCase;
