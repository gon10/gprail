import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle, faCheckCircle,  faExclamationCircle, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"

export default function InfoBox(props) {

  let type = props.type? props.type : "info";
  let icon = <FontAwesomeIcon icon={faInfoCircle} className="info-box__icon" />

  switch(type) {
    case "info":
      icon = <FontAwesomeIcon icon={faInfoCircle} className="info-box__icon" />
      break;
    case "success":
      icon = <FontAwesomeIcon icon={faCheckCircle} className="info-box__icon" />
      break;
    case "alert":
      icon = <FontAwesomeIcon icon={faExclamationCircle} className="info-box__icon" />
      break;
    case "warning":
      icon = <FontAwesomeIcon icon={faExclamationTriangle} className="info-box__icon" />
      break;
    default:
      icon = <FontAwesomeIcon icon={faInfoCircle} className="info-box__icon" />
  }

  let classProps = ['info-box'];
  if (type) {classProps.push('info-box--'+type)}
  if (props.fullWidth) {classProps.push('info-box--full-width')}
  if (props.className) {classProps.push(props.className)}

  return (
    <div className={classProps.join(' ')}>
      {icon}
      {props.children}
    </div>
  )
};