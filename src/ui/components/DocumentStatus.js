import React from 'react';
import { Link } from "react-router-dom";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function DocumentStatus(props) {

  let classProps = ['document-status'];
  if (props.disabled) {classProps.push('document-status--disabled')}
  if (props.link) {classProps.push('document-status__link')}
  if (props.className) {classProps.push(props.className)}

  const status = props.status? props.status : "CREATED";
  const link = props.link? props.link : undefined;
  const onClick = props.onClick? props.onClick : undefined;

  switch(status.toLowerCase()) {
    case "draft":
      classProps.push('document-status--draft');
      break;
    case "created":
      classProps.push('document-status--created');
      break;
    case "updated":
      classProps.push('document-status--updated');
      break;
    case "approved":
      classProps.push('document-status--approved');
      break;
    case "active":
      classProps.push('document-status--active');
      break;
    case "withdrawn":
      classProps.push('document-status--withdrawn');
      break;
    default:
      classProps.push('document-status--created');
  }

  return (
    <>
      {link? <Link className={classProps.join(' ')} to={link}>
        {status} <FontAwesomeIcon icon={faEdit} />
      </Link> : 
      onClick? <div className={classProps.join(' ')} onClick={onClick}>
        {status} <FontAwesomeIcon icon={faEdit} />
      </div> :
      <div className={classProps.join(' ')} >
        {status}
      </div>}
    </>
  )
};