import React from 'react';
import styles from './signup.module.css';

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
      onError: () => {

      }
    }
  );

  signUp();

  if (data) {
    window.sessionStorage.setItem("token", data.signUp);
  }

  return (
    <div>
      {error && <p className = {styles.message}> Error: User already registered </p>}
      {loading && <p className = {styles.message} > Loading... </p>}
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
        <h1 className = {styles.title} > Sleuthin </h1>
        <div className = {styles.signUpBox}>
          {startSignUpQuery ||
              <fieldset className = {styles.fieldset}>
                <legend> Sign Up </legend>

                <form >
                  <div id = "userform" >
                    <label > Username < /label>
                    <input name = "username" type = "text" onChange = {e => setUsername(e.target.value)} />
                  </div>
                  <br / >
                  <div id = "passform">
                    < label > Password < /label>
                    <input name = "password"type = "password" onChange = {e => setPassword(e.target.value)}/>
                    <input className = {styles.submit} id = "submit" type = "submit" onClick = {e =>  {e.preventDefault(); start(true)}} />
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
