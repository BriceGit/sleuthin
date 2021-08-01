import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SignIn from './views/signin/signin.js'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const client = new ApolloClient({
  uri: 'http://localhost:4041/app',
  cache: new InMemoryCache(),
});


function App() {
  return (
    <SignIn />
  );
}

ReactDOM.render(
  <ApolloProvider client = {client}>
    < App />
  </ApolloProvider>,
  document.getElementById('root')
);
