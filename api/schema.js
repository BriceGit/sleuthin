const {gql} = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    cases: [Case!]!
    casesWorkingOn: [Case!]!
    casesHelpedSolve: [Case!]!
  }

  type PageResult {
    cases: [Case!]!
    hasNextPage: Boolean!
    cursor: ID!
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
    getCurrentUser: User
    getUser(userid: String!): User
    getCase(caseid: String!): Case
  }

  type Mutation {
    signUp(username: String! password: String!): String!
    signIn(username: String! password: String!): String!
    postCase(input: CaseInput!): Case!
    deleteCase (caseid: String!): Case!
    updateCase(caseid: String! input: CaseInput!): Boolean!
    toggleWorkOnCase(caseid: String!): [String!]!
    postComment(caseid: String!, text: String!): Comment!
    markCaseAsSolved(caseid: String!): Boolean!
  }
`

module.exports = typeDefs;
