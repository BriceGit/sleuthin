//BUSINESS LOGIC LAYER implementation

"use strict"

let mongoose = require('mongoose');

const { AuthenticationError, ForbiddenError, ApolloError} = require('apollo-server-express');

//Mongoose collections
const {User, Case, Comment} = require('./models');

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


//utility authentication method for verifying tokens are valid
const authenticateToken = async(token) => {

  if(!token) throw new Error()

  try {
    let userIdObject = await jwt.verify(token, process.env.JWT_KEY);

    let returnedUser  = await User.findById(userIdObject.userid).populate("cases");

    if (!returnedUser) throw new Error();
  }
  catch (e) {
    throw new AuthenticationError("Error verifying user identity");
  }

  return returnedUser;
};

//query user collection to see if login credentials are valid. Then return an identifying token.
const signIn = async (username, password) => {
  try {
    //find user document associated with username
    let returnedUser = await User.findOne({username: username});

    //if no user object is not returned throw an error
    if (!returnedUser) throw new Error();

    //check if the returnedUser's hashed password matches the submitted plaintext password

    let passwordMatched = await bcrypt.compare(password, returnedUser.password);

    //if the password doesnt match throw an error
    if (!passwordMatched) throw new Error(');
  }
  catch (e) {
    throw new AuthenticationError("Error signing in.");
  }
  //return token containing the encrypted user id;
  return jwt.sign({userid: returnedUser._id}, process.env.JWT_KEY);

};

const postCase = async (inputCase, token) => {
  try {
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

    user.cases.push(persistedCase._id);

    await User.create(user);

    return Case.findById(persistedCase._id).select("-password").populate('client').populate('comments');
  }
  catch (e) {
    throw new ApolloError ("Error: Could not create case.")
  }
};

const markCaseAsSolved = async (caseid, token) => {
  try {
    let user = await authenticateToken(token);

    let matchedCase = await Case.findById(caseid).populate('client');

    // if (!matchedCase) throw new ForbiddenError("requested case does not exist");

    console.log(matchedCase.client._id);
    console.log(user._id);

    if (String(matchedCase.client._id) != String(user._id)) {
      throw new ForbiddenError("you do not have the priveledges to delete this case.");
      return false;
    }

    await Case.findByIdAndUpdate(caseid, {solved: true});

    return true;
  }
  catch (e) {
    throw new ApolloError("Could not mark case as solved")
  }

};

const deleteCase = async (caseid, token) => {
  try {
    let user = await authenticateToken(token);

    let matchedCase = await Case.findById(caseid).populate('client');

    if (!matchedCase) throw new Error();

    console.log(matchedCase.client._id);
    console.log(user._id);

    if (String(matchedCase.client._id) != String(user._id)) {
      throw new Error();
    }

    return await Case.findByIdAndDelete(caseid).populate('client');
  }
  catch (e) {
    throw new ApolloError("Could not delete case")
  }
};

const updateCase = async (caseid, input, token) => {
  try {
    let user = await authenticateToken(token);

    let matchedCase = await Case.findById(caseid).populate('client');

    if (!matchedCase) throw new ForbiddenError("requested case does not exist");

    if (String(matchedCase.client._id) != String(user._id)) {
      throw new Error();
    }

    await Case.findByIdAndUpdate(caseid, {description: input.description, title: input.title, clues: input.clues}).populate('client');

    return true;
  }
  catch (e) {
    throw new ApolloError("Could not update case")
  }
};

const postComment = async (caseid, text, token) => {
  try {
    let user = await authenticateToken(token);

    let matchedCase = await Case.findById(caseid);

    if (!matchedCase) throw new Error("requested case does not exist");

    let newComment = {
      user: mongoose.Types.ObjectId(user._id),
      text: text
    };


    newComment = await Comment.create(newComment);

    matchedCase.comments.push(newComment._id);

    await Case.findByIdAndUpdate(caseid, {comments: matchedCase.comments});

    return await Comment.findById(newComment._id).populate('user');
  }
  catch (e) {
    throw new ApolloError("Could not post comment");
  }
};

const toggleWorkOnCase = async (caseid, token) => {
  try {
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
  }
  catch (e) {
    throw new ApolloError("Could not toggle working on case")
  }
};

const getCurrentUser = async (token) => {
  try {
    return await authenticateToken(token);
  }
  catch (e) {
    throw ApolloError("Could not retrieve current user")
  }
}



exports.signIn = signIn;
exports.postCase = postCase;
exports.toggleWorkOnCase = toggleWorkOnCase;
exports.deleteCase = deleteCase;
exports.updateCase = updateCase;
exports.postComment = postComment;
exports.getCurrentUser = getCurrentUser;
exports.markCaseAsSolved = markCaseAsSolved;
