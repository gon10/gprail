import React, { useState, useRef } from 'react';
import { faInfoCircle, faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick'
import Button from '../base/Button'

export default function InputLoading(props) {
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));

  let classProps = ['input-loading__wrap'];
  if (props.disabled) {classProps.push('input-loading__wrap--disabled')}
  if (props.className) {classProps.push(props.className)}
  if (props.error) {classProps.push('input-loading__wrap--error')}
  if (props.noLabel) {classProps.push('input-loading__wrap--no-label')}
  if (props.noMargin) {classProps.push('input-loading__wrap--no-margin')}

  return (
    <div ref={ref} className={classProps.join(' ')} >
      {props.noLabel? "" : 
        <label className="input__label" htmlFor={props.id ? props.id : props.name}>
          {props.label ? props.label : props.name}: {props.required ? <span className="small">[Required]</span> : ""}
        </label>
      }
      {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : "" }
      <div className="input-loading__input">
        {props.searchButton ? "" : <svg className="sc-bczRLJ iuXIBt search-icon" width="20" height="20" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 
          5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 
          4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
        </svg>}
        <div className="input-loading">
          <div className="input-loading__square"></div><div className="input-loading__square"></div><div className="input-loading__square"></div>
        </div>
        {props.searchButton ? <Button action="primary" className="input-loading__search-button">
        <FontAwesomeIcon icon={faSearch} className="input-loading__icon" />
      </Button> : ""}
      </div>
      {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
          <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
        </p> : "" }
      {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : "" }
      {props.children}
    </div>
  )
}