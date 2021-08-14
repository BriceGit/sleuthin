const express = require('express');
const app = express();

const cors = require('cors');

const helmet = require('helmet');

const jwt = require("jsonwebtoken");

const resolvers = require("./resolvers");

const typeDefs = require("./schema");

const initDB = require('./database');

const {Users} = require('./models');

const {ApolloServer} = require('apollo-server-express')

require('dotenv').config();

//general purpose catch statement. Will add more specific error handling at a later date
let port = process.env.PORT || 4041;

// app.use(helmet());
app.use(cors());

const server = new ApolloServer(
  {
    //graphql schema
    typeDefs,
    //graphql resolvers
    resolvers,

    //setting context
    context: async ({req}) => ({
        //get token
        token: req.headers.authorization
    })

  }
);

//mount Apollo middleware on apollo server
server.applyMiddleware({app, path: '/api'});

//start listening on port
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

//conect to mongodb database
initDB();
