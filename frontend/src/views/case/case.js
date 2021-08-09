import React from 'react';
import {useState} from 'react';
import {gql, useQuery, useMutation} from '@apollo/client';

import {useParams} from "react-router-dom";

import styles from './case.module.css';


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
        <input type = "submit" onClick = {handleSubmit}/>
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

  const {loading, error, data} = useQuery(GET_CASE, {variables: {caseid}});

  if (error) return <p> {error.message} </p>
  if (loading) return <p> loading... </p>
  if (data) return (
    <div className = {styles.container}>
        <h1 className = {styles.title}> {data.getCase.title} </h1>
        <h2 className = {styles.user} >posted by: {data.getCase.client.username} </h2>
        <p className = {data.solved? styles.solved : styles.unsolved} > {data.solved? 'solved': 'unsolved'} </p>
        <p className = {styles.description}> Description: {data.getCase.description} </p>
        <p className = {styles.cluestitle}> Clues: </p>
        <ol className = {styles.clues}>
          {data.getCase.clues.map( (x, idx) => <li key = {idx}> {x} </li>)}
        </ol>
        <p className = {styles.attd}> Add to the discussion: </p>
        <Comment query = {GET_CASE} caseid = {data.getCase.id} />
        < hr />
        <ul className = {styles.commentList}>
          {data.getCase.comments.map( x => <li key = {x.id}> <p> {x.user.username}: {x.text} </p> </li>)}
        </ul>
    </div>
  )
}


export default Case;
