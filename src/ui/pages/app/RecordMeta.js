import React, { useState, useRef } from 'react'
import { faTag,  faHistory, faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from '../../base'
import OutsideClick from '../../../Helpers/OutsideClick'
import { Link } from "react-router-dom"
import DocumentStatus from '../../components/DocumentStatus'

export default function RecordMeta(props) {
  const ref = useRef();
  const [showMeta, setShowMeta] = useState(false);
  OutsideClick(ref, () => setShowMeta(false));

  const id = props.id ? props.id : "";
  const roles = props.roles ? props.roles : [];
  //const viewType = props.viewType ? props.viewType : "view-record";
  //console.log(roles);
  const crudTargets = props.crudTargets
  return (
    <div ref={ref} className="meta">
      {roles.includes('READ') ?
        <Button action="tertiary" className="meta__button" onClick={() => setShowMeta(!showMeta)}>
          <DocumentStatus status={props.status} /> <FontAwesomeIcon icon={faTag} className="meta__icon" />
        </Button>
        : null}
      {roles.includes('READ') ?
        <div className={showMeta ? "meta__details meta__details--show" : "meta__details"}>
          <h4><FontAwesomeIcon icon={faTag} className="meta__icon" /> Status: <DocumentStatus status={props.status} /></h4>
          <h5>CREATED:</h5>
          <p>{new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "numeric",
            minute: "numeric",
            hour12: true
          }).format(new Date(props.createdAt))}</p>
          <p className="small">Created by: {props.createdBy}</p>
          <br />
          <h5>LAST MODIFIED:</h5>
          <p>{new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "numeric",
            minute: "numeric",
            hour12: true
          }).format(new Date(props.lastModifiedAt))}</p>
          <p className="small">Modified by: {props.lastModifiedBy}</p>

          {props.dataLineage ? <><br />
            <h4><FontAwesomeIcon icon={faCloudDownloadAlt} className="meta__icon" /> Data Lineage</h4>
            <h5>FROM SYSTEM:</h5>
            <p>{props.dataLineage.from}</p>
            <br />
            <h5>LAST IMPORTED:</h5>
            <p>{new Intl.DateTimeFormat("en-GB", {
              year: "numeric",
              month: "long",
              day: "2-digit",
              hour: "numeric",
              minute: "numeric",
              hour12: true
            }).format(new Date(props.dataLineage.lastSyncedAt))}</p>
            <p className="small">System primary key: {props.dataLineage.sourceSystemPrimaryKey}</p></> : null}

          <p className="meta__version">Version ref: {props.version}
            <Link to={crudTargets && crudTargets.history? `/app/${crudTargets.history}` : "/app/view-record/history"} state={{ id: id }} className="button button--tertiary meta__history__button">
              <FontAwesomeIcon icon={faHistory} className="meta__icon" />
            </Link>
          </p>
        </div>
        : null}
    </div>
  )
}