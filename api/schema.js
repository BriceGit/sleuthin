const {gql} = require('apollo-server-express');

const typeDefs = gql`
  # Basic User Object. Stores information about a registered user.
  type User {
    id: ID!
    username: String!
    cases: [Case!]!
    casesWorkingOn: [Case!]!
    casesHelpedSolve: [Case!]!
  }

  # Groundwork for later pagination implementation
  type PageResult {
    cases: [Case!]!
    hasNextPage: Boolean!
    cursor: ID!
  }

  # Central of the web app. "Cases" that users post, discuss on, and solve
  type Case {
    id: ID!
    client: User!
    title: String!
    description: String!
    clues: [String!]!
    solved: Boolean!
    comments: [Comment!]!
  }

  # Input Case Input type for use in deleteCase
  input CaseInput {
    title: String!
    description: String!
    clues: [String!]!
  }

  # Construct for comments that users post under cases.
  type Comment {
    id: ID!
    user: User!
    text: String!
  }

  # INTEGRAL QUERIES AND MUTATIONS BELOW

  type Query {
    getAllCases: [Case!]!
    getAllUsers: [User!]!
    getCurrentUser: User
    getUser(userid: String!): User
    getCase(caseid: String!): Case
    getPage(cursor: ID!): PageResult!
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
