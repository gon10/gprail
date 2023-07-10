import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from '../base'

export default function DeleteDialogue(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const navigateTo = props.to? props.to : 0;

  const navigate = useNavigate();

  const api = props.api? props.api : `${process.env.REACT_APP_BASE_URL}/api/railhub/secured/document/`;
  const id = props.id? props.id : undefined;
  const collectionName = props.collectionName? props.collectionName : undefined;

  let classProps = ['delete-dialogue'];
  if (props.fullwidth) {classProps.push('delete-dialogue--fullwidth')}
  if (props.disabled) {classProps.push('delete-dialogue--disabled')}
  if (props.className) {classProps.push(props.className)}

  useEffect(() => {
    if (id === undefined) {setError({message: "No record id provided"})}
  }, [id])
  
  const handleDelete = id => {
    console.log('/api/railhub/secured/document/'+collectionName+'/'+id);
    let query = {
      collectionName: 'network-gbr-additionalProtectionType',
      id: id
    };

    axios.delete(`${api + collectionName}/${id}`,query)
    .then(
      (result) => {
      console.log(result);
      setIsLoaded(true);
      setTimeout(()=> {
        navigate(navigateTo);
       }, 2000);
      },
      (error) => {
        console.log(error);
        setError(error)
      }
    );
  }

  return (
    <Modal showModal={props.showDelete}
    setShowModal={props.setShowDelete}
    title={error? error.message : isLoaded? "Record withdrawn" : "Withdraw this record?"}
    footer={error? null : isLoaded? null : <Button action="primary" 
      className="button--warning" 
      onClick={() => handleDelete(id)}><FontAwesomeIcon icon={faTrashAlt} /> Withdraw</Button>}
    className={isLoaded? "modal--success" : "modal--warning"}
    >
      {error? <>
          <p>Sorry there was a problem withdrawing this record. </p>
          <p>Please close and try again.</p>
        </>
        : isLoaded? <p>Record withdrawn successfully.</p> 
        : <p>Please confirm that you would like to withdraw this record.</p>}
    </Modal>
  )
};