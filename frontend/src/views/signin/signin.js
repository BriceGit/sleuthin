import React from 'react';
import './signin.css';

import {gql, useMutation} from '@apollo/client';


function SignInHelper(props) {

  const SIGN_IN = gql`
    mutation Token($username: String!, $password: String!) {
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
      {error && <p> Error {error.message} </p>}
      {loading && <p> Loading... </p>}
      {data && <p> Data: {data.signIn} </p>}
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
            <form >
            <label > Username < /label>
            <input name = "username"type = "text"onChange = {e => setUsername(e.target.value)} />
            <br / >
            < label > Password < /label>
            <input name = "password"type = "password" onChange = {e => setPassword(e.target.value)}/>

            <input type = "submit" onClick = {e =>  {e.preventDefault(); start(true)}} />
            <br / >
            <a href = ""> Sign Up < /a>
            </form>
          }
          {startSignInQuery &&
            <SignInHelper username = {username} password = {password} />
          }

        </ div>
    )
}
