import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import axios from 'axios'
import { useLocation, useNavigate } from "react-router-dom"
import { faPlus, faEdit, faCircleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { escape, eachRecursive } from '../../Helpers/StringHelpers'
import { Button, Textarea } from '../base'
import SingleOption from './SingleOption'

export default function CreateUpdateDialogue(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [recordComments, setRecordComments] = useState();
  const roles = props.roles ? props.roles : [];
  const mode = props.mode ? props.mode : "create";
  const updateMoveNextEnabled = props.updateMoveNextEnabled? props.updateMoveNextEnabled : false;
  const location = useLocation()
  const filterValue = location.state &&location.state.filterValue? location.state.filterValue : props.filterValue;
  const nextId = localStorage.getItem('nextId') ? JSON.parse(localStorage.getItem('nextId')) : null;

  let statusOptions = props.statusOptions ? props.statusOptions : [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'WITHDRAWN', label: 'Withdrawn' }
  ]

  if (!roles.includes('DELETE') || mode === "create") {
    statusOptions = statusOptions.filter(function (opt) {
      return opt.value !== 'WITHDRAWN';
    });
  }

  const navigateTo = props.to ? props.to : 0;
  const navigate = useNavigate();

  const api = props.api ? props.api : `${process.env.REACT_APP_BASE_URL}/api/railhub/secured/document`;
  const id = props.id ? props.id : undefined
  //console.log(`create update props id = ${id}`)
  const data = props.data ? props.data : "missing data"
  const schema = props.schema ? props.schema : "missing schema";
  const documentInfo = props.documentInfo ? props.documentInfo : "missing documentInfo"
  const defaultStatus = documentInfo.status ? documentInfo.status : "DRAFT";
  const [status, setStatus] = useState(defaultStatus);
  const documentHistory = props.documentHistory ? props.documentHistory : "missing documentHistory"

  useEffect(() => {
    if (documentInfo) {
      setStatus(defaultStatus)
      //console.log(status)
    }
  }, [documentInfo, defaultStatus])

  let classProps = ['create-dialogue'];
  if (props.fullwidth) { classProps.push('create-dialogue--fullwidth') }
  if (props.disabled) { classProps.push('create-dialogue--disabled') }
  if (props.className) { classProps.push(props.className) }

  useEffect(() => {
    if (id === undefined && mode === "update") { setError({ message: "No record id provided" }) }
  }, [id])

  const filterArrays = (obj) => {
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        if (obj[key].length === 0) {
          // delete obj[key];
        } else {
          const numKeys = Object.keys(obj[key][0]).length;
          //the protectionAndWarningSystems wont be setted, so the condition as to be Object.keys(item).length === numKeys -1 for the new ones
          //but then the old ones comes with protectionAndWarningSystems setted
          obj[key] = obj[key].filter(item => Object.keys(item).length > 1 && (Object.keys(item).length === numKeys || Object.keys(item).length === numKeys - 1));
        }
      } else if (typeof obj[key] === 'object') {
        filterArrays(obj[key]);
      }
    }
    return obj;
  }

  const handleSubmit = async (data, goNext) => {
    const comment = recordComments ? escape(recordComments) : ""
    const config = {
      headers: { "Document-History-Comment": comment }
    };

    const meta = (mode === "create") ?
      {
        "$schema": schema,
        "documentInfo": {
          "status": status,
          "createdAt": new Date(),
          "createdBy": {
            "name": "",
            "userId": ""
          },
          "lastModifiedAt": new Date(),
          "lastModifiedBy": {
            "name": "frontend",
            "userId": "frontend"
          }
        },
        "documentHistory": []
      } :
      {
        "_id": {
          "$oid": id
        },
        "$schema": schema,
        "documentInfo": {
          "status": status,
          "createdAt": documentInfo.createdAt,
          "createdBy": documentInfo.createdBy,
          "lastModifiedAt": new Date(),
          "lastModifiedBy": {
            "name": "frontend",
            "userId": "frontend"
          }
        },
        "documentHistory": documentHistory
      }

    let promises = []
    if (data.documents) {
      data.documents.forEach(element => {
        if (element.apiCollectionName === "network-gbr-saLocation") {
          delete element.id;
          delete element._version;
          delete element.apiCollectionName;
          let query = { ...element };
          promises.push(axios.patch(`${api}`, query, config).then(
            (result) => {
              console.log(result);
              console.log("reached result")   
              return result
            },
            (error) => {
              console.log(error);
              // setError(error)
              return error.response;
            }
          ))
        }
      });
      let values = await Promise.all(promises);
      values.forEach(element => {
         console.log("element", element)
       });
      setIsLoaded(true);
      setTimeout(() => {    
        console.log("reached navigate")    
        props.setShowModal(false)
        setIsLoaded(false);
        if (updateMoveNextEnabled && goNext) {
          console.log(`navigate to next id = ${nextId}`)
          navigate(navigateTo, {state: {id: nextId, filterValue: filterValue}});
        } else {
          console.log(`navigate to current id = ${id}`)
          navigate(navigateTo, {state: {id: id, filterValue: filterValue}});
        }
      }, 2000);
      return;
    }

    filterArrays(data);
    const query = { ...meta, ...data }
    if (mode === "create") {
      eachRecursive(query)
      axios.post(api, query, config)
        .then(
          (result) => {
            console.log(result);
            setIsLoaded(true);
            setTimeout(() => {
              navigate(navigateTo);
            }, 2000);
          },
          (error) => {
            console.log(error);
            setError(error)
          }
        );
    } else if (mode === "update") {
      eachRecursive(query)
      console.log("reached update")   
      axios.patch(api, query, config)
        .then(
          (result) => {
            console.log(result);
            setIsLoaded(true);
            setTimeout(() => {
              console.log("reached navigate in update")   
              navigate(navigateTo);
            }, 2000);
          },
          (error) => {
            console.log(error);
            setError(error)
          }
        );
    } else {
      setError("Missing information to handle your request. Please refresh your browser window and try again.")
    }
  }

  return (
    <Modal showModal={props.showModal}
      setShowModal={props.setShowModal}
      onClose={e => setError()}
      title={error ? error.message : isLoaded ? "Record " + mode + "d" : mode.charAt(0).toUpperCase() + mode.substring(1).toLowerCase() + " record?"}
      footer={error ? null : isLoaded ? null : <>
        <Button action={updateMoveNextEnabled? "secondary" : "primary"}
          className="button--success"
          onClick={() => handleSubmit(data, false)}>
          <FontAwesomeIcon icon={(mode === "create") ? faPlus : faEdit} /> {mode.charAt(0).toUpperCase() + mode.substring(1).toLowerCase()}
        </Button>
        {updateMoveNextEnabled? <Button action="primary"
          className="button--success"
          disabled={nextId? false : true}
          onClick={() => {handleSubmit(data, true)}}>
          <FontAwesomeIcon icon={faCircleRight} /> Update &amp; Next
        </Button> : null}
      </>}
      className={isLoaded ? "modal--success" : error ? "modal--warning" : "modal--default"}
    >
      {error ? <>
        <p>Sorry there was a problem {mode.slice(0, -1)}ing this record. </p>
        <p>Please close and try again.</p>
      </>
        : isLoaded ? <p>Record {mode}d successfully.</p>
          : <>
            <p>Please confirm that you would like to {mode} this record.</p>
            <SingleOption
              key="status"
              name="status"
              label="Update status"
              helpText='Here you can update the status of this document. For example from "DRAFT" to "APPROVED."'
              displayType="dropdown"
              options={statusOptions}
              fullWidth={false}
              value={{ value: status, label: status.charAt(0).toUpperCase() + status.substring(1).toLowerCase() }}
              defaultValue={{ value: status, label: status.charAt(0).toUpperCase() + status.substring(1).toLowerCase() }}
              onChange={(e) => setStatus(e.value)}
            />
            <Textarea
              key="recordComments"
              type="text"
              name="recordComments"
              label="Add record comments"
              helpText={`You can add comments to the record history here. Comments will be added once you click ${mode}.`}
              numRows={4}
              fullWidth={true}
              value={recordComments}
              onChange={(e) => setRecordComments(e.target.value)}
            />
          </>
      }
    </Modal>
  )
};