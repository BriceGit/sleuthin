import React from 'react';
import './signin.css';

import {gql, useMutation} from '@apollo/client';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";


function SignInHelper(props) {

  const SIGN_IN = gql`
    mutation signin($username: String!, $password: String!) {
      signIn(username: $username, password: $password)
    }
  `;


  const [signIn, { loading, error, data }] = useMutation(SIGN_IN,
    {
      variables: {
        username: props.username,
        password: props.password
      },
      onError(err) {
        console.log(err);
      }
    }
  );

  signIn();


  return (
    <div>
      {error && <p> Error: {error.message} </p>}
      {loading && <p> Loading... </p>}
      {data && <Redirect to= "/homepage"/>}
    </div>
  )

}

export default function SignInForm () {


    let [username, setUsername] = React.useState("");
    let [password, setPassword] = React.useState("");
    let [startSignInQuery, start] = React.useState(false);


    return (
      <div id = "signin-box" >
        {startSignInQuery ||
          <fieldset>
            <legend> Sign In </legend>
            <form >
              <label > Username < /label>
              <input name = "username"type = "text"onChange = {e => setUsername(e.target.value)} />
              <br / >
              < label > Password < /label>
              <input name = "password"type = "password" onChange = {e => setPassword(e.target.value)} />

              <input type = "submit" onClick = {e =>  {e.preventDefault(); start(true)}} />
              <br / >
              <Link to = "/signup"> Sign Up < /Link>
              </form>
          </fieldset>
        }
        {startSignInQuery &&
          <SignInHelper username = {username} password = {password} />
        }
      </ div>
    )
}
