import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SignIn from './views/signin/signin.js'
import SignUp from './views/signup/signup.js'
import HomePage from './views/homepage/homepage.js'
import Case from './views/case/case.js'
import CaseForm from './views/caseform/caseform.js'

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



const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(
    {
      headers:
      {
        authorization: window.sessionStorage.getItem('token')
      }
    });
  return forward(operation);
});

const httpLink = new HttpLink({
  uri:'http://localhost:4041/app'
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
