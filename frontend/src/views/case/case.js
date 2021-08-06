import React from 'react';
import {useState} from 'react';
import {gql, useQuery, useMutation} from '@apollo/client';

import {useParams} from "react-router-dom";


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
    refetchQueries: [
      props.query,
      "getCase"
    ]
  });


  function handleSubmit (x) {
    x.preventDefault();
    post();

  }

  return (
    <div>
      <form>
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
    <div>
      <h1> {data.getCase.title} </h1>
      <h2> posted by {data.getCase.client.username} </h2>
      <p> Description: {data.getCase.description} </p>
      <p> Clues: </p>
      <ol>
        {data.getCase.clues.map( x => <li key = {x.id}> {x} </li>)}
      </ol>
      <p> Add to the discussion: </p>
      <Comment query = {GET_CASE} caseid = {data.getCase.id} />
      <ul>
        {data.getCase.comments.map( x => <li key = {x.id}> <p> {x.user.username}: {x.text} </p> </li>)}
      </ul>
    </div>
  )
}


export default Case;
