const express = require('express');
const app = express();

require('dotenv').config();

const jwt = require("jsonwebtoken");

const resolvers = require("./resolvers");
const typeDefs = require("./schema");

const {connect, getUser} = require('./database');

const {ApolloServer} = require('apollo-server-express')

// function that determines if the client is a registered user
// intended to be used within the context element of the apollo server options
// a result of false means the user is not registered or a authorization header was not semantics
// a result of an objectId indicates the user is registered


let port = process.env.PORT || 4042;

const server = new ApolloServer(
  {
    //graphql schema
    typeDefs,
    //graphql resolvers
    resolvers,

    context: async ({req}) => ({
        //checks if authorization header
        user: await getUser(req)
    })

  }
);

//mount ApolloServer on express appliation
server.applyMiddleware({app, path: '/api'});

//start listening on 4042
app.listen(port);

//conect to mongodb database
connect();
