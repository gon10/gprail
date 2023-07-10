import React, { useState, useRef } from 'react';
import { faSearch, faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick'
import Button from './Button'

export default function Input(props) {
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));

  let classProps = ['input__wrap'];
  if (props.disabled) {classProps.push('input__wrap--disabled')}
  if (props.className) {classProps.push(props.className)}
  if (props.error) {classProps.push('input__wrap--error')}
  if (props.noLabel) {classProps.push('input__wrap--no-label')}
  if (props.noMargin) {classProps.push('input__wrap--no-margin')}
  if (props.type === "search") {classProps.push('input__wrap--search')}

  let inputProps = {
    type: props.type ? props.type : "text",
    className: (props.type === "search") ? "input search" : "input",
    id: props.id ? props.id : props.name,
    value: props.value,
    defaultValue: props.defaultValue,
    name: props.name,
  };
  if (props.min) {inputProps.min = props.min}
  if (props.max) {inputProps.max = props.max}
  if (props.step) {inputProps.step = props.step}
  if (props.disabled) {inputProps.disabled = props.disabled}
  if (props.readonly) {inputProps.readonly = props.readonly}
  inputProps.required = props.required ? props.required : false;
  if (props.minLength) {inputProps.minLength = props.minLength}
  if (props.maxLength) {inputProps.maxLength = props.maxLength}
  if (props.placeholder) {inputProps.placeholder = props.placeholder}
  if (props.accept) {inputProps.accept = props.accept}
  if (props.onClick) {inputProps.onClick = props.onClick}
  if (props.onChange) {inputProps.onChange = props.onChange}
  if (props.onBlur) {inputProps.onBlur = props.onBlur}
  if (props.name) {inputProps.name = props.name}
  
  const onSearch = props.onSearch? props.onSearch : "";

  return (
    <div ref={ref} className={classProps.join(' ')} >
      {props.noLabel? "" : 
        <label className="input__label" htmlFor={props.id ? props.id : props.name}>
          {props.label ? props.label : props.name}: {inputProps.required ? <span className="small">[Required]</span> : ""}
        </label>
      }
      {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : "" }
      <input 
        /*{...register(props.name, { 
          required: inputProps.required, 
          minLength: { value: props.minLength, message: "Please enter more characters"},
          maxLength: { value: props.maxLength, message: "Please enter less characters"},
          }
        )}*/
        {...inputProps}
        />
      {(props.type === "search") ? <Button action="primary" className="input__search-button" onClick={onSearch}>
        <FontAwesomeIcon icon={faSearch} className="input__icon" />
      </Button> : ""}
      {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
          <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
        </p> : "" }
      {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : "" }
      {props.children}
    </div>
  )
}