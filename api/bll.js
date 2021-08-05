//BUSINESS LOGIC LAYER implementation

"use strict"

let mongoose = require('mongoose');

const { AuthenticationError, ForbiddenError} = require('apollo-server-express');

//Mongoose collections
const {User, Case, Comment} = require('./models');

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const authenticateToken = async(token) => {

  if(!token) throw new AuthenticationError("not signed in")

  let userIdObject = await jwt.verify(token, process.env.JWT_KEY);

  let returnedUser  = await User.findById(userIdObject.userid);

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
  return jwt.sign({userid: returnedUser._id}, process.env.JWT_KEY);

};

const postCase = async (inputCase, token) => {

  let user = await authenticateToken(token);

  let newCase = {
    client: user._id,
    title: inputCase.title,
    description: inputCase.description,
    clues: inputCase.clues,
    solved: false,
    commments: []
  }

  let persistedCase = await Case.create(newCase);

  return Case.findById(persistedCase._id).select("-password").populate('client').populate('comments');
};


const deleteCase = async (caseid, token) => {
  let user = await authenticateToken(token);

  let matchedCase = await Case.findById(caseid).populate('client');

  if (!matchedCase) throw new ForbiddenError("requested case does not exist");

  console.log(matchedCase.client._id);
  console.log(user._id);

  if (String(matchedCase.client._id) != String(user._id)) {
    throw new ForbiddenError("you do not have the priveledges to delete this case.");
  }

  return await Case.findByIdAndDelete(caseid).populate('client');
};

const updateCaseDescription = async (caseid, text, token) => {
  let user = await authenticateToken(token);

  let matchedCase = await Case.findById(caseid).populate('client');

  if (!matchedCase) throw new ForbiddenError("requested case does not exist");

  if (String(matchedCase.client._id) != String(user._id)) {
    throw new ForbiddenError("you do not have the priveledges to edit this case.");
  }

  return await Case.findByIdAndUpdate(caseid, {description: text}).populate('client');
};

const postComment = async (caseid, text, token) => {

  let user = await authenticateToken(token);

  let matchedCase = await Case.findById(caseid);

  if (!matchedCase) throw new ForbiddenError("requested case does not exist");

  let newComment = {
    user: mongoose.Types.ObjectId(user._id),
    text: text
  };

  newComment = await Comment.create(newComment);

  matchedCase.comments.push(newComment._id);

  await Case.findByIdAndUpdate(caseid, {comments: matchedCase.comments});

  return await Comment.findById(newComment._id).populate('user');
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



exports.signIn = signIn;
exports.postCase = postCase;
exports.toggleWorkOnCase = toggleWorkOnCase;
exports.deleteCase = deleteCase;
exports.updateCaseDescription = updateCaseDescription;
exports.postComment = postComment;
