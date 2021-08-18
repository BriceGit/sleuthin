const {User, Case, Clue, Comment} = require('./models');

const {signIn, postCase, toggleWorkOnCase, deleteCase,
   updateCase, postComment, getCurrentUser, markCaseAsSolved} = require('./bll');

require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const resolvers = {
  Query: {
    //query Case Model for all cases.
    getAllCases: async () => {
      allCases = await Case.find({}).populate('client')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          model: 'User'
        }
      });

      return allCases;
    },
    //query User collection for all users.
    getAllUsers: async () => {
      return await User.find({});
    },
    //query user collection for one specific user based off of provided userid
    getUser: async (parent, args) => {
      return await User.findOne({_id: args.userid}, {password: 0});
    },
    //use the jwt token to derive client identity return object representing the logged in user.
    getCurrentUser: async (parent, args, context) => {
      let user = await getCurrentUser(context.token);
      delete user["password"];
      return user;
    },
    //query case collection for one specfic case based off of the provided case id
    getCase: async (parent,args) => {
      return await Case.findById(args.caseid).populate('client')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          model: 'User'
        }
      });
    }
  },

  Mutation: {
    // use client's username and password inputs to generate a hashed userid which will be used henceforth to identify the client.
    signUp: async (parent, args) => {
      //hash and salt the entered password
      let hash = await bcrypt.hash(args.password, 10);

      //create user object
      const newUser = {
        username: args.username,
        password: hash,
        cases: [],
        casesWorkingOn: [],
        casesHelpedSolve: []
      }

      //persist user object to database and return the created mongoose object
      let createdUser = await User.create(newUser);

      //remove password field from the returned user
      delete newUser.password;

      return jwt.sign({userid: createdUser._id}, process.env.JWT_KEY);
    },
    // use client's username and password inputs to return hashed userid token.
    signIn: async (parent, args) => {
      return await signIn(args.username, args.password);
    },
    // use user input to persist new Case to case collection
    postCase: async (parent, args, context) => {
      return await postCase(args.input, context.token);
    },
    //use provided caseid to remove case from case collection.
    deleteCase: async (parent, args, context) => {
      return await deleteCase(args.caseid, context.token);
    },
    //use provided user input to update case in case collection.
    updateCase: async (parent, args, context) => {
      return await updateCase(args.caseid, args.input, context.token);
    },
    //placeholder. Will allow user mark a case that they're working on.
    toggleWorkOnCase: async (parent, args, context) => {
      return await toggleWorkOnCase(args.caseid, context.token);
    },
    // persists a comment to the comment database and associates it with a post.
    postComment: async (parent, args, context) => {
      return await postComment(args.caseid, args.text, context.token);
    },
    //marks a case as solved
    markCaseAsSolved: async (parent, args, context) => {
      return await markCaseAsSolved(args.caseid, context.token);
    }
  }
}

module.exports = resolvers;
