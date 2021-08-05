import React from 'react';

import {
  Link
} from "react-router-dom";

import {gql, useQuery} from '@apollo/client';

function Cases() {

  const GET_CASES = gql`
    query {
      getAllCases {
        id
        title
        solved
      }
    }
  `;

  const {loading,error,data} = useQuery(GET_CASES);

  if (error) return (<p> {error.message} </p>);

  if (loading) return (<p> Loading ... </p>);

  return (
    <div>
      <ul>
        {data.getAllCases.map( (x) => {
          return (
            <li key = {x.id}>
              <Link to= {`/case/${x.id}` }> {x.title} </ Link>
              <p> {x.solved? 'solved': 'unsolved'} </p>
            </li>
          );
        })}
      </ul>
    </div>
  )
}

export default function HomePage() {
  return (
    <div>
      <header>
        Sleuthin—A mystery is afoot!
        <nav>
          <Link to = "/homepage"> Home </Link>
          <Link to = "/profile:id"> Profile </Link>
        </nav>
      </header>
      <body>
        <Cases />
      </body>

    </div>
  )
}
