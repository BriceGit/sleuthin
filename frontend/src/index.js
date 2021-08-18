

import React from 'react';
import {useEffect} from 'react';
import ReactDOM from 'react-dom';
import SignIn from './views/signin/signin.js'
import SignUp from './views/signup/signup.js'
import HomePage from './views/homepage/homepage.js'
import Case from './views/case/case.js'
import CaseForm from './views/caseform/caseform.js'
import EditCaseForm from './views/editcaseform/editcaseform.js'
import UserCases from './views/usercases/usercases.js'

import './reset.module.css';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  HttpLink
} from "@apollo/client";

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


//use apollo link to pass token
const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(
    {
      headers:
      {
        //get token from sessionStorage and put into header
        authorization: window.sessionStorage.getItem('token')
      }
    });
  return forward(operation);
});


const httpLink = new HttpLink({
  uri: process.env.REACT_APP_API
})


const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});




function App() {
  return (
    <Router>
      <Switch>
        <Route path = "/signup"> <SignUp /> </Route>
        <Route path = "/signin"> <SignIn /> </Route>
        <Route path ="/homepage"> <HomePage /> </Route>
        <Route path ="/case/:caseid"> <Case /> </Route>
        <Route path = "/postcase"> <CaseForm /> </Route>
        <Route path = "/usercases"> <UserCases /> </Route>
        <Route path = "/editcase/:caseid"> <EditCaseForm /> </Route>
        <Route path = "/"> <SignIn /> </Route>
      </Switch>
    </Router>
  )
}

ReactDOM.render(
  <ApolloProvider client = {client}>
    < App />
  </ApolloProvider>,
  document.getElementById('root')
);
