import React from 'react';

import {useState} from 'react';

import {gql, useMutation} from '@apollo/client';

import {Redirect} from 'react-router';

import './caseform.css'


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
  let [debug, setDebug]  = useState(null);
  let [debug1, setDebug1]  = useState(null);

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
  setDebug(idx);

  let newClues = clues.filter(function (element, index) {
    return (index != idx);
  })

  setClues(newClues);
}

  return (
    <div>
      <fieldset>
        <legend> post a case </legend>
        <form>
          <label> title </label>
          <input type = "text" onChange = {(x) => setTitle(x.target.value)} />
          <br />
          <label> description </label>
          <textarea onChange = {(x) => setDescription(x.target.value)} />
          <br />
          <label> Clue: </label>
          <textarea onChange = {(x) => setClueInput(x.target.value)} value = {clueInput}/>
          <br />
          <button onClick = {handleSubmitClue}> Add Clue </button>
          <ol>
            { clues.map( (element, idx) => <li key = {idx} index = {idx} id = "clue" onClick = {handleClueClick}> {element} </li>) }
          </ol>
          <input type = "submit" onClick = {handleSubmit}/>
        </form>
      </ fieldset>
      {data && <Redirect to = "/homepage" />}
    </div>
  )
}
