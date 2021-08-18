import React from 'react';

import {useState} from 'react';

import {
  Link,
  Redirect
} from "react-router-dom";

import {gql, useQuery, useMutation} from '@apollo/client';

import styles from '../../stylesheets/usercases.module.css'

export default function UserCases() {

  const GET_USER_CASES = gql`
    query {
      getCurrentUser {
        cases {
          id
          title
          description
          solved
        }
      }
    }
  `;

  const MARK_CASE_AS_SOLVED = gql`
    mutation mcas($caseid: String!) {
      markCaseAsSolved(caseid: $caseid)
    }
  `;

  const DELETE_CASE = gql`
    mutation dc($caseid: String!) {
        deleteCase(caseid: $caseid) {
          id
        }
    }`;

  const {loading,error,data} = useQuery(GET_USER_CASES, {
    fetchPolicy: "network-only"
  });


  if (error) return (<p> {error.message} </p>);

  if (loading) return (<p> Loading ... </p>);

  function SolvedButton (props) {
    const [markSolved, {loading, error, data}] = useMutation(MARK_CASE_AS_SOLVED,
      {
        variables: { caseid: props.caseid},
        refetchQueries: [{query: GET_USER_CASES}]
      });

      return (
        <button onClick = { markSolved }> Mark Case As Solved</button>
      )
  }

  function DeleteButton (props) {
    const [deleteCase, {loading, error, data}] = useMutation(DELETE_CASE,
      {
        variables: { caseid: props.caseid},
        refetchQueries: [{query: GET_USER_CASES}]
      });

      return (
        <button onClick = { deleteCase }>delete case</button>
      )
  }

  function EditButton (props) {
    let [clicked, setClicked] = useState(false);

    return (
      <div>
        <button onClick = {x => setClicked(true)} > Edit Case </button>
        {clicked && <Redirect to = {`/editcase/${props.caseid}`} /> }
      </div>
    )
  }

  return (
    <div>
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
      <p className = {styles.title}>Your Cases:</p>
      <ul className = {styles.ul}>
        {data.getCurrentUser.cases.map( (x) => {
          return (
            <li key = {x.id} caseid = {x.id} className = {styles.li}>
              <Link to= {`/case/${x.id}` }> {x.title} </ Link>
              <p className = {x.solved? styles.solved : styles.unsolved} > {x.solved? 'solved': 'unsolved'} </p>
              <EditButton  className = {styles.editButton} caseid = {x.id} />
              <SolvedButton caseid = {x.id} />
              <DeleteButton caseid = {x.id} />
            </li>
          );
        })}
      </ul>
    </div>
  )
}
