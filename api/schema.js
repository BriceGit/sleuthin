const {gql} = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    openCases: [Case!]!
    casesWorkingOn: [Case!]!
    casesHelpedSolve: [Case!]!
  }

  type Case {
    id: ID!
    client: User!
    title: String!
    description: String!
    clues: [String!]!
    solved: Boolean!
    comments: [Comment!]!
  }

  input CaseInput {
    title: String!
    description: String!
    clues: [String!]!
  }

  type Comment {
    id: ID!
    user: User!
    text: String!
  }

  type Query {
    getAllCases: [Case!]!
    getAllUsers: [User!]!
    getUser(userid: String!): User
    getCase(caseid: String!): Case
  }

  type Mutation {
    signUp(username: String! password: String!): String!
    signIn(username: String! password: String!): String!
    postCase(input: CaseInput!): Case!
    deleteCase (caseid: String!): Case!
    updateCaseDescription(caseid: String! text: String!): Case!
    toggleWorkOnCase(caseid: String!): [String!]!
    postComment(caseid: String!, text: String!): Comment!
  }
`

module.exports = typeDefs;
