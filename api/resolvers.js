const {User, Case, Clue, Comment} = require('./models');

const {signIn, postCase, toggleWorkOnCase, deleteCase,
   updateCase, postComment, getCurrentUser, markCaseAsSolved} = require('./bll');

require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const resolvers = {
  Query: {
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
    getAllUsers: async () => {
      return await User.find({});
    },
    getUser: async (parent, args) => {
      return await User.findOne({_id: args.userid}, {password: 0});
    },
    getCurrentUser: async (parent, args, context) => {
      let user = await getCurrentUser(context.token);
      delete user["password"];
      return user;
    },
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
