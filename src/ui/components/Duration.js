import React, { useState, useRef } from 'react';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick';
import Input from '../base/Input';

export default function Duration(props) {
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));

  let classProps = ['duration__wrap'];
  if (props.disabled) {classProps.push('duration__wrap--disabled')}
  if (props.className) {classProps.push(props.className)}
  if (props.error) {classProps.push('duration__wrap--error')}
  if (props.noLabel) {classProps.push('duration__wrap--no-label')}
  if (props.noMargin) {classProps.push('duration__wrap--no-margin')}

  let inputProps = {
    className: "duration__input",
    type: "number",
    noMargin: true,
    hideError: true,
  };
  if (props.disabled) {inputProps.disabled = props.disabled}
  if (props.readonly) {inputProps.readonly = props.readonly}
  if (props.error) {inputProps.error = props.error}
  inputProps.required = props.required ? props.required : false;
  if (props.placeholder) {inputProps.placeholder = props.placeholder}
  if (props.onChange) {inputProps.onChange = props.onChange}
  if (props.onBlur) {inputProps.onBlur = props.onBlur}

  let allFields = ["years","months","days","hours","minutes","seconds"];
  let include = props.include ? props.include : allFields;

  let fields = allFields.filter( function( el ) {
    return include.includes( el );
  } );

  return (
    <div ref={ref} className={classProps.join(' ')} >
      {props.noLabel? "" : 
        <label className="duration__label" htmlFor={props.id ? props.id : props.name}>
          {props.label ? props.label : props.name}: {props.required ? <span className="small">[Required]</span> : ""}
        </label>
      }
      {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : "" }
      
      { fields.includes("years") ? <Input name="years" label="Years" min="0" max="99" {...inputProps} /> : "" }
      { fields.includes("months") ? <Input name="months" label="Months" min="0" max="11" {...inputProps} /> : "" }
      { fields.includes("days") ? <Input name="days" label="Days" min="0" max="31" {...inputProps} /> : "" }
      { fields.includes("hours") ? <Input name="hours" label="Hours" min="0" max="23" {...inputProps} /> : "" }
      { fields.includes("minutes") ? <Input name="minutes" label="Minutes" min="0" max="59" {...inputProps} /> : "" }
      { fields.includes("seconds") ? <Input name="seconds" label="Seconds" min="0" max="59" {...inputProps} /> : "" }

      {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
          <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
        </p> : "" }
      {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : "" }
      {props.children}
    </div>
  )
}