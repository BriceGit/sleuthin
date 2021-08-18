import React from 'react';
import styles from '../../stylesheets/signin.module.css';

import {gql, useMutation} from '@apollo/client';

import {
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

  if (data) {
    window.sessionStorage.setItem("token", data.signIn);
  }

  return (
    <div>
      {error && <p className  = {styles.message}> Error: {error.message}. Please refresh and try again. </p>}
      {loading && <p className = {styles.message}> Loading... </p>}
      {data && <Redirect to= "/homepage"/>}
    </div>
  )

}

export default function SignInForm () {


    let [username, setUsername] = React.useState("");
    let [password, setPassword] = React.useState("");
    let [startSignInQuery, start] = React.useState(false);


    return (
      <div>
        <h1 className = {styles.title}> Sleuthin </h1>
        <div className = {styles.signInBox}>
          {startSignInQuery ||
            <fieldset>
              <legend>Sign In</legend>
              <form>
                <div className = {styles.userform}>
                  <label >Username< /label>
                  <input type = "text"onChange = {e => setUsername(e.target.value)} />
                </div>
                <div className = {styles.passform} >
                  < label >Password< /label>
                  <input type = "password" onChange = {e => setPassword(e.target.value)} />
                  <button className = {styles.submit}  onClick = {e =>  {e.preventDefault(); start(true)}} > Sign In </button>
                </ div>
                <Link to = "/signup" className = {styles.signUpLink}>Don't have an account? Sign Up here.< /Link>
              </form>
            </fieldset>
          }
          {startSignInQuery &&
            <SignInHelper username = {username} password = {password} />
          }
        </ div>
      </div>
    )
}
