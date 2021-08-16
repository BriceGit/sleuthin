import React from 'react';

import {useState} from 'react';

import {gql, useMutation, useQuery} from '@apollo/client';

import {Redirect, useParams} from 'react-router';

import styles from '../../stylesheets/editcaseform.module.css';


const GET_CASE = gql`
  query gc($caseid: String!) {
    getCase(caseid: $caseid) {
      title
      description
      clues
    }
  }`

  const EDIT_CASE = gql`
    mutation uc($input: CaseInput!, $caseid: String!) {
      updateCase(input: $input, caseid: $caseid)
    }
  `;

function GenericCaseForm(props) {

  let [title, setTitle] = useState(props.title);
  let [description, setDescription] = useState(props.description);
  let [clues, setClues] = useState(props.clues);
  let [clueInput, setClueInput] = useState("");

  const [post, {data, loading, error}] = useMutation(EDIT_CASE, {
    variables: {caseid: props.id, input: {title, description, clues}},
    onError: () => {

    }
  })

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
    <div className = {styles.container} >
      <fieldset className = {styles.fieldset}>
        <legend>Edit Case</legend>
        <form>
          <div className = {styles.titleform} >
            <label>Title:</label>
            <input type = "text" onChange = {(x) => setTitle(x.target.value)} value = {title}/>
          </div>
          <div className = {styles.description}>
            <label>Description:</label>
            <textarea onChange = {(x) => setDescription(x.target.value)} value = {description}/>
          </div>
          <div className = {styles.clueform}>
            <label>Clue:</label>
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
    </div>
  )
}


export default function EditCaseForm (props) {


  let {caseid} = useParams();

  const {loading, error, data} = useQuery(GET_CASE, {variables: {caseid} });

  return (
    <div>
      {data && <GenericCaseForm id = {caseid} title = {data.getCase.title} description = {data.getCase.description} clues = {data.getCase.clues} /> }
      {loading && <p> loading... </p>}
      {error && <p> Error: Incorrect input to edit case. Referesh the page and make sure the title and and description are included </p>}
    </div>
  )
}
