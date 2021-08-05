import React from 'react';
import {gql, useQuery} from '@apollo/client';

import {useParams} from "react-router-dom";

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
      <ul>
        {data.getCase.comments.map( x => <li key = {x.id}> {x} </li>)}
      </ul>
    </div>
  )
}


export default Case;
