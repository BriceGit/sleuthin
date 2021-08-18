import React from 'react';

import styles from '../../stylesheets/homepage.module.css';

import {
  Link,
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


  const {loading,error,data} = useQuery(GET_CASES , {
    fetchPolicy: "cache-and-network"
  });

  if (error) return (<p> {error.message} </p>);

  if (loading) return (<p> Loading ... </p>);

  return (
    <div className = {styles.container}>
      <ul className = {styles.cases}>
        {data.getAllCases.map( (x) => {
          return (
            <li key = {x.id} className = {styles.li}>
              <Link to= {`/case/${x.id}` } className = {styles.a}> {x.title} </ Link>
              <p className = {x.solved? styles.solved : styles.unsolved} > {x.solved? 'solved': 'unsolved'} </p>
            </li>
          );
        })}
      </ul>
    </div>
  )
}

export default function HomePage() {

  return (
    <div className = {styles.container}>
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
      <div className = {styles.cases}>
        <Cases />
      </div>

    </div>
  )
}
