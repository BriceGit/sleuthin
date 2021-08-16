import React from 'react';

import {useState} from 'react';

import {gql, useMutation} from '@apollo/client';

import {
  Link,
  Redirect
} from "react-router-dom";

import styles from '../../stylesheets/caseform.module.css';


const GET_CASES = gql`
  query {
    getAllCases {
      id
      title
      solved
    }
  }
`;

export default function CaseForm (props) {

  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [clues, setClues] = useState([]);
  let [clueInput, setClueInput] = useState("");

  const POST_CASE = gql`
    mutation pcase($input: CaseInput! ) {
      postCase(input: $input) {
        id
        title
        description
        clues
      }
    }
  `;

  const [post, {loading, error, data}] = useMutation(POST_CASE, {
    variables: {
      input: {
        title,
        description,
        clues
      }
    },
    onError: () => {

    }
  });




function handleSubmit(e) {
    e.preventDefault();
    post();

  }

function handleSubmitClue(e) {
  e.preventDefault();
  setClues(clues.concat(clueInput));
  setClueInput("");
}

function handleClueClick(e) {
  let idx = e.target.getAttribute('index');

  let newClues = clues.filter(function (element, index) {
    return (index != idx);
  })

  setClues(newClues);
}

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
      <fieldset className = {styles.fieldset}>
        <legend>Post a Case</legend>
        <form>
          <div className = {styles.titleform}>
            <label>Title</label>
            <input type = "text" onChange = {(x) => setTitle(x.target.value)} />
          </div>

          <div className = {styles.description}>
            <label>Description</label>
            <textarea onChange = {(x) => setDescription(x.target.value)} />
          </div>

          <div className = {styles.clueform}>
            <label>Clue</label>
            <textarea onChange = {(x) => setClueInput(x.target.value)} value = {clueInput}/>
            <button onClick = {handleSubmitClue}> Add Clue </button>
          </div>
          <hr />
          <div className = {styles.clues}>
            <p>Clues:</p>
            <ol>
              { clues.map( (element, idx) => <li key = {idx} index = {idx} className = {styles.clue} onClick = {handleClueClick}> {element} </li>) }
            </ol>
          </div>
          <div className = {styles.submit}>
            <button onClick = {handleSubmit}>Submit Case </button>
          </div>
        </form>
      </ fieldset>
      {data && <Redirect to = "/homepage" />}
      {error && <p>  Error: Incorrect input to case. Referesh the page and make sure the title and and description are included </p>}
    </div>
  )
}
