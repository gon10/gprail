import React from 'react'
import { Button } from '../../base'
import { useLocation, Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEye, faHistory, faTrashAlt, faCheck } from '@fortawesome/free-solid-svg-icons'

export default function SingleRecordCRUDMenu(props) {
  const roles = props.roles
  const viewType = props.viewType
  const setData = props.setData
  const setShowDelete = props.setShowDelete
  const setShowCreate = props.setShowCreate
  const documentStatus = props.documentStatus
  const isLoaded = props.isLoaded
  const initialValues = props.initialValues
  const id = props.id
  const location = useLocation()
  const filterValue = location.state &&location.state.filterValue? location.state.filterValue : props.filterValue;

  //console.log(initialValues)

  return (
    <ul className="app__page__crud-menu">
      {roles.includes('READ') ?
        <li className="app__page__crud-menu__li">
          <Link to="view" state={{ id: id, filterValue: filterValue }} className="button button--secondary" onClick={(e) => { setData(); }}>
            <FontAwesomeIcon icon={faEye} className="button__icon" />{viewType === "splitscreen" ? null : " View Record"}
          </Link>
        </li>
        : null}
      {roles.includes('UPDATE') ?
        <li className="app__page__crud-menu__li">
          <Link to="edit" className="button button--secondary" state={{ id: id, filterValue: filterValue }}>
            <FontAwesomeIcon icon={faEdit} className="button__icon" onClick={(e) => { setData(); }} />{viewType === "splitscreen" ? null : " Edit Record"}
          </Link>
        </li>
        : null}
      {roles.includes('DELETE') && documentStatus !== "WITHDRAWN" ?
        <li className="app__page__crud-menu__li">
          <Button action="secondary" onClick={() => setShowDelete(true)}>
            <FontAwesomeIcon icon={faTrashAlt} className="button__icon" />{viewType === "splitscreen" ? null : " Withdraw Record"}
          </Button>
        </li>
        : null}
      {roles.includes('UPDATE') && documentStatus === "WITHDRAWN" ?
        <li className="app__page__crud-menu__li">
          <Button action="secondary" onClick={() => {
            setData(isLoaded ? initialValues : null)
            setShowCreate(true)
          }}>
            <FontAwesomeIcon icon={faCheck} className="button__icon" onClick={(e) => { setData(); }} />{viewType === "splitscreen" ? null : " Reinstate"}
          </Button>
        </li>
        : null}
      {roles.includes('READ') ?
        <li className="app__page__crud-menu__li">
          <Link to="history" state={{ id: id, filterValue: filterValue }} className="button button--secondary">
            <FontAwesomeIcon icon={faHistory} className="button__icon" onClick={(e) => { setData(); }} />{viewType === "splitscreen" ? null : " Record History"}
          </Link>
        </li>
        : null}
    </ul>
  )
}