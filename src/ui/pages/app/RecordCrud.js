import React, { useState, useRef } from 'react'
import  { faEye, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from '../../base'
import OutsideClick from '../../../Helpers/OutsideClick'
import { Link } from "react-router-dom"
import DeleteDialogue from '../../components/DeleteDialogue'

export default function RecordCrud(props) {
  const ref = useRef();
  const [showDelete, setShowDelete] = useState(false);
  OutsideClick(ref, () => setShowDelete(false));

  const id = props.id ? props.id : undefined;
  const filterValue = props.filterValue ? props.filterValue : undefined;
  const collectionName = props.collectionName ? props.collectionName : undefined;
  const roles = props.roles ? props.roles : [];
  const viewType = props.viewType ? props.viewType : "view-record";
  const crudTargets = props.crudTargets

  return (
    <div className="record-crud">
      {roles.includes('READ') ?
        <Link to={crudTargets && crudTargets.read? `/app/${crudTargets.read}` : `/app/${viewType}/view`} state={{ id: id, filterValue: filterValue }} className="button button--tertiary record-crud__button">
          <FontAwesomeIcon icon={faEye} className="record-crud__icon" />
        </Link>
        : null}
      {roles.includes('UPDATE') ?
        <Link to={crudTargets && crudTargets.update? `/app/${crudTargets.update}` : `/app/${viewType}/edit`} state={{ id: id, filterValue: filterValue }} className="button button--tertiary record-crud__button">
          <FontAwesomeIcon icon={faEdit} className="record-crud__icon" />
        </Link>
        : null}
      {roles.includes('DELETE') ?
        <Button action="tertiary"
          className="record-crud__button"
          onClick={() => setShowDelete(true)}
          disabled={props.status === "WITHDRAWN" ? true : false}
        >
          <FontAwesomeIcon icon={faTrashAlt} className="record-crud__icon" />
        </Button>
        : null}

      <DeleteDialogue
        showDelete={showDelete}
        setShowDelete={setShowDelete}
        id={id}
        collectionName={collectionName}
      />
    </div>
  )
}
