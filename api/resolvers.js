const {User, Case, Clue, Comment} = require('./models');

const {signIn, postCase, toggleWorkOnCase} = require('./bll');


const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const resolvers = {
  Query: {
    getAllCases: async () => {
      return await Case.find({});
    },

    getUser: async (parent, args) => {
      return await User.find({_id: args.userid}, {password: 0});
    },

    getCase: async (parent,args) => {
      return await Case.findById(args.caseid);
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
        openCases: [],
        casesWorkingOn: [],
        casesHelpedSolve: []
      }

      //persist user object to database and return the created mongoose object
      let createdUser = await User.create(newUser);

      //remove password field from the returned user
      delete newUser.password;

      return jwt.sign({userid: createdUser._id}, 'secret');
    },
    signIn: async (parent, args) => {
      return await signIn(args.username, args.password);
    },
    postCase: async (parent, args, context) => {
      return await postCase(args.input, context.token);
    },
    deleteCase: async (parent, args, context) => {

    },
    toggleWorkOnCase: async (parent, args, context) => {
      return await toggleWorkOnCase(args.caseid, context.token);
    },
    postComment: async (parent, args, context) => {

    }
  }
}

module.exports = resolvers;
