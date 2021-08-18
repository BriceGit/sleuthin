const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();

const jwt = require("jsonwebtoken");

const resolvers = require("./resolvers");

const typeDefs = require("./schema");

const initDB = require('./database');

const {Users} = require('./models');

const {ApolloServer} = require('apollo-server-express')

let port = process.env.PORT || 4041

app.use(helmet());
app.use(cors());

const server = new ApolloServer(
  {
    //graphql schema
    typeDefs,
    //graphql resolvers
    resolvers,

    context: async ({req}) => ({
        //get jwt from authorization header
        token: req.headers.authorization
    })

  }
);

//mount ApolloServer on express appliation
server.applyMiddleware({app, path: '/api'});

//start listening on port of the environment
app.listen(port, () => {
  console.log(`listening on ${port}`)
});

//conect to mongodb database
initDB();
