const {gql} = require('apollo-server-express');

const typeDefs = gql`
  # Central focus of application. These are cases for users to post and solve.
  type Mystery {
    id: ID!
    description: String!
    clues: [String!]!
    client: String!
    comments: [String!]!
    solved: Boolean!
  }

  type User {
    id: ID!
    username: String!
    password: String!
  }

  type Query {
    mysteries: [Mystery]!
    mystery (id: ID!): Mystery
  }

  type Mutation {
    newMystery(description: String!, clues: [String!]!): Mystery!
    removeMystery(id: ID!):Mystery!
    signUp(username: String!, password: String!):String!
    signIn(username: String!, password: String!):String!
  }

`

module.exports = typeDefs;
