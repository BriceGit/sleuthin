//import mongoose models
const {User, Case, Clue, Comment} = require('./models');

//methods from the business logic layer
const {signIn, postCase, toggleWorkOnCase, deleteCase,
   updateCase, postComment, getCurrentUser, markCaseAsSolved} = require('./bll');

const bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken");

const {ApolloError} = require('apollo-server-express');

require('dotenv').config();

const resolvers = {
  Query: {
    //return all cases in Case model. Populate them according to graphql schema
    getAllCases: async () => {
      try {
        allCases = await Case.find({}).populate('client')
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            model: 'User'
          }
        })
      }
      catch (e) {
        thow ApolloError ("Error retrieving resource.");
      }

      return allCases;
    },
    //query all users from database
    getAllUsers: async () => {
      try {
        return await User.find({});
      }
      catch (e) {
        throw ApolloError ("Error retrieving resource");
      }
    },
    //query for single user
    getUser: async (parent, args) => {
      try {
        return await User.findOne({_id: args.userid}, {password: 0});
      }
      catch (e) {
        throw ApolloError ("Error retrieving reource");
      }
    },
    //query current user
    getCurrentUser: async (parent, args, context) => {
      try {
        let user = await getCurrentUser(context.token);
      }
      catch (e) {
        throw ApolloError ("Error retrieving resource");
      }
      delete user["password"];
      return user;
    },
    //query for single case
    getCase: async (parent,args) => {
      try {
        return await Case.findById(args.caseid).populate('client')
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            model: 'User'
          }
        })
      }
      catch (e) {
        throw ApolloError ("Error retrieving resource");
      };
    }
  },

  Mutation: {
    // sign Up user and return a token that will be saved in local storage
    signUp: async (parent, args) => {
      //hash and salt the entered password
      try {
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
      }
      catch (e) {
        throw new ApolloError("Sign Up Failed");
      }
      //remove password field from the returned user
      delete newUser.password;

      return jwt.sign({userid: createdUser._id}, process.env.JWT_KEY);
    },
    signIn: async (parent, args) => {
      return await signIn(args.username, args.password);
    },
    postCase: async (parent, args, context) => {
      return await postCase(args.input, context.token);
    },
    deleteCase: async (parent, args, context) => {
      return await deleteCase(args.caseid, context.token);
    },
    updateCase: async (parent, args, context) => {
      return await updateCase(args.caseid, args.input, context.token);
    },
    toggleWorkOnCase: async (parent, args, context) => {
      return await toggleWorkOnCase(args.caseid, context.token);
    },
    postComment: async (parent, args, context) => {
      return await postComment(args.caseid, args.text, context.token);
    },
    markCaseAsSolved: async (parent, args, context) => {
      return await markCaseAsSolved(args.caseid, context.token);
    }
  }
}

module.exports = resolvers;
