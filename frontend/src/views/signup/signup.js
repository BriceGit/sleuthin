import React from 'react';
import './signup.css';

import {gql, useMutation} from '@apollo/client';

import {
  Redirect
} from 'react-router';


function SignUpHelper(props) {

  const SIGN_UP = gql`
    mutation signup($username: String!, $password: String!) {
      signUp(username: $username, password: $password)
    }
  `;


  const [signUp, { loading, error, data }] = useMutation(SIGN_UP,
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

  signUp();

  if (data) {
    window.sessionStorage.setItem("token", data.signUp);
  }

  return (
    <div>
      {error && <p> Error: {error.message} </p>}
      {loading && <p> Loading... </p>}
      {data && <Redirect to= "/homepage"/>}
    </div>
  )

}

export default function SignUpForm () {


    let [username, setUsername] = React.useState("");
    let [password, setPassword] = React.useState("");
    let [startSignUpQuery, start] = React.useState(false);


    return (
      <div>
        <h1> Sleuthin </h1>
        <div id = "signup-box" >
          {startSignUpQuery ||
              <fieldset>
                <legend> Sign Up </legend>

                <form >
                  <div id = "userform" >
                    <label > Username < /label>
                    <input name = "username"type = "text"onChange = {e => setUsername(e.target.value)} />
                  </div>
                <br / >
                  <div id = "passform">
                    < label > Password < /label>
                    <input name = "password"type = "password" onChange = {e => setPassword(e.target.value)}/>
                    <input id = "submit" type = "submit" onClick = {e =>  {e.preventDefault(); start(true)}} />
                  </div>
                </form>
              </fieldset>
            }
            {startSignUpQuery &&
              <SignUpHelper username = {username} password = {password} />
            }
        </ div>
      </div>
    )
}
