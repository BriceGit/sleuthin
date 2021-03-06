import React from 'react';
import {useState} from 'react';
import {gql, useQuery, useMutation} from '@apollo/client';

import {useParams} from "react-router-dom";

import styles from '../../stylesheets/case.module.css';

import {
  Link,
  Redirect
} from "react-router-dom";


function Comment (props) {

  let [commentText, setComment] = useState("");

  const POST_COMMENT = gql`
      mutation postcom($caseid: String!, $text: String!) {
        postComment(caseid: $caseid, text: $text) {
          id
          user {
            username
          }
        }
      }
  `;

  const [post, {data, loading, error}] = useMutation(POST_COMMENT, {
    variables: {caseid: props.caseid, text: commentText},
    refetchQueries: [ {query: props.query, variables: {caseid: props.caseid}}]
  });


  function handleSubmit (x) {
    x.preventDefault();
    post();

  }

  return (
    <div>
      <form className = {styles.comment}>
        <textarea onChange = {x => setComment(x.target.value)} value = {commentText}>
        </textarea>
        <button className = {styles.submit} onClick = {handleSubmit}> Post Comment </button>
      </form>
    </div>
  )
}

function Case () {
    let {caseid} = useParams();


    const GET_CASE = gql`
      query gc($caseid: String!) {
        getCase(caseid: $caseid) {
          client {
            username
            id
          }
          id
          title
          description
          clues
          solved
          comments {
            user {
              username
            }
            id
            text
          }
        }
      }`

  //

  const {loading, error, data} = useQuery(GET_CASE, {variables: {caseid}, fetchPolicy: "network-only", pollInterval: 500});

  if (error) return <p> {error.message} </p>
  if (loading) return <p> loading... </p>
  if (data) return (
    <React.Fragment>
      <header className = {styles.header}>
        <h1>Sleuthin</h1>
        <h2>A mystery solving social network</h2>
        <nav className = {styles.nav}>
          <Link to = "/homepage" className ="homelink">Home</Link>
          <Link to = "/postcase" className = "homelink">Post a Case</Link>
          <Link to = "/usercases" className = "homelink">My Cases</Link>
        </nav>
      </header>
      <hr />
      <div className = {styles.container}>
          <hr />
          <h1 className = {styles.title}> {data.getCase.title} </h1>
          <br />
          <h2 className = {styles.user} >posted by: {data.getCase.client.username} </h2>
          <br />
          <p className = {data.getCase.solved? styles.solved : styles.unsolved} > {data.getCase.solved? 'solved': 'unsolved'} </p>
          <br />
          <p className = {styles.description}> Description: {data.getCase.description} </p>
          <br />

          <p className = {styles.cluestitle}> Clues: </p>

          <br />
          <ol className = {styles.clues}>
            {data.getCase.clues.map( (x, idx) => <li key = {idx}> {x} </li> )}
          </ol>
          <hr className = {styles.hr} />
          <p className = {styles.attd}> Add to the discussion: </p>

          <Comment query = {GET_CASE} caseid = {data.getCase.id} />

          <ul className = {styles.commentList}>
            {data.getCase.comments.map( x => <li key = {x.id}> <p> {x.user.username}: {x.text} </p> </li>)}
          </ul>
      </div>
    </ React.Fragment>
  )
}


export default Case;
//
