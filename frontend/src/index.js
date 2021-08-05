import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SignIn from './views/signin/signin.js'
import SignUp from './views/signup/signup.js'
import HomePage from './views/homepage/homepage.js'
import Case from './views/case/case.js'

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

const client = new ApolloClient({
  uri: 'http://localhost:4041/app',
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
