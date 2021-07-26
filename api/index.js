const express = require('express');
const app = express();

require('dotenv').config();

const jwt = require("jsonwebtoken");

const resolvers = require("./resolvers");
const typeDefs = require("./schema");

const initDB = require('./database');

const {Users} = require('./models');



const {ApolloServer} = require('apollo-server-express')

// function that determines if the client is a registered user
// intended to be used within the context element of the apollo server options
// a result of false means the user is not registered or a authorization header was not semantics
// a result of an objectId indicates the user is registered


const getLoggedInUser = async (req) => {

  //if authorization header not sent in request return false

  if (!req.headers.authorization) return false;

  else {

    try {
      // check if the string sent in the header is a valid token

      let user = jwt.verify(req.headers.authorization, process.env.JWT_KEY);

      //if key not valid return false
      if (!user) return false;

      // check userid in string against users in database
      let match = await Users.findById(user.userid);

      let username = match.username;

      let userid = match._id;

      return match;

    }
    //general purpose error catch statement.
    catch (e) {
      console.log(e.message)
    }
  }
}

let port = process.env.PORT || 4042;    //general purpose catch statement. Will add more specific error handling at a later date

const server = new ApolloServer(
  {
    //graphql schema
    typeDefs,
    //graphql resolvers
    resolvers,

    context: async ({req}) => ({
        //checks if authorization header
        user: await getLoggedInUser(req)
    })

  }
);

//mount ApolloServer on express appliation
server.applyMiddleware({app, path: '/app'});

//start listening on 4042
app.listen(port, () => {
  console.log(`listening on ${port}`)
});

//conect to mongodb database
initDB();
