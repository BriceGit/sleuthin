const {Users, Mysteries} = require('./database');

const Mongoose = require('mongoose');

const {Schema, ObjectId} = require('mongoose');

const {AuthenticationError, ValidationError} = require('apollo-server-express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


class Mystery{
  constructor(description, clues, client) {
    this.description = description;
    this.clues = clues;
    this.client = client;
    this.comment = [];
    this.solved = false;
  }
}

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

const resolvers = {
  Query: {

    mysteries: async () => {
      return await Mysteries.find({});
    },

    mystery: async (parent, args) => {
      let mystery = await Mysteries.findById(Mongoose.Types.ObjectId(args.id));
      return mystery;
    }
  },

  Mutation: {

    //mutation to push a new mystery to the database
    newMystery: async (parent, args, {user}) => {
      try {

        console.log(user);
        //throw error if not logged in
        if (!user) {
          throw new AuthenticationError("not logged in");
        }

        //if previous check passes, username is gauranteed to exist in database
        //so no need for a follow up check to see if username exists
        let username = await Users.findById(user)


        //create a mystery object
        const newMystery = new Mystery(args.description, args.clues, username.username);

        //push object to mysteries collection
        return await Mysteries.create(newMystery);
      }
      //rethrow error
      catch (e) {
        throw e;
      }
    },

    //mutation to remove a mystery from the database
    removeMystery: async (parent, args, {user}) => {
      try {

        // throw error if client is not logged in
        if (!user) {
          throw new AuthenticationError("Not Logged In");
        }

        // query database for target Mystery
        const targetMystery = await Mysteries.findById(Mongoose.Types.ObjectId(args.id));

        // if mystery does not exist throw an error
        if (!targetMystery) {
          throw new ValidationError("Mystery does not exist")
        }


        let username = await Users.findById(user);

        // if the client is not the creator of the mystery throw an error
        if (username.username !== targetMystery.client) {
          throw new AuthenticationError("Can't delete Mystery that you did not create")
        }

        //return mystery after it has been deleted
        return await Mysteries.findByIdAndDelete(Mongoose.Types.ObjectId(args.id));
      }
      // rethrow error
      catch (e){
        throw e;
      }
    },

    //mutation to add a new user to the databse and give them a token
    signUp: async (parent, args) => {
      try {
        //salt and hash user inputted password
        const hash = await bcrypt.hash(args.password, 10);
        //push new user account to users collections
        const user = await Users.create(new User(args.username, hash));
        //send an encryted token containing the users id
        return await jwt.sign({userid: user._id}, process.env.JWT_KEY);
      }
      catch (e) {
        //rethrow error
        throw e;
      }
    },

    //mutation to validate a use and give them a token
    signIn: async (parent, args) => {

      try {
        // query database to see if the user exists in the database
        var user = await Users.findOne({username: args.username});

        //if user does not exist throw an error
        if (!user) throw new AuthenticationError("Username or password does not match")
      }
      // rethrow error
      catch (e) {
        throw e;
      }

      try {
        //check if password is correct for user
        let result = await bcrypt.compare(args.password, user.password);

        //if it is, send an encrypted userid
        if (result) {
          return jwt.sign({userid: user._id}, process.env.JWT_KEY)
        }
        //otherwise throw an error
        else {
          throw new AuthenticationError("Username or password does not match")
        }
      }
      //rethrow error
      catch (e) {
        throw e;
      }

    }
  }
}

module.exports = resolvers;
