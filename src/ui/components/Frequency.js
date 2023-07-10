import React, { useState, useRef } from 'react';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick';
import Input from '../base/Input';
import Select from '../base/Select';

export default function Frequency(props) {
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));

  let classProps = ['frequency__wrap'];
  if (props.disabled) {classProps.push('frequency__wrap--disabled')}
  if (props.className) {classProps.push(props.className)}
  if (props.error) {classProps.push('frequency__wrap--error')}
  if (props.noLabel) {classProps.push('frequency__wrap--no-label')}
  if (props.noMargin) {classProps.push('frequency__wrap--no-margin')}

  let inputProps = {
    className: "frequency",
    type: "number",
    noLabel: true,
    noMargin: true,
    id: props.id ? props.id : props.name,
    //name: props.name
  };
  //inputProps.value = props.value ?  props.value : "";
  inputProps.min = props.min ? props.min : '0';
  if (props.max) {inputProps.max = props.max}
  if (props.step) {inputProps.step = props.step}
  if (props.disabled) {inputProps.disabled = props.disabled}
  if (props.readonly) {inputProps.readonly = props.readonly}
  if (props.error) {inputProps.error = props.error}
  inputProps.hideError = true;
  inputProps.required = props.required ? props.required : false;
  if (props.minLength) {inputProps.minLength = props.minLength}
  if (props.maxLength) {inputProps.maxLength = props.maxLength}
  if (props.placeholder) {inputProps.placeholder = props.placeholder}
  if (props.onChange) {inputProps.onChange = props.onChange}
  if (props.onBlur) {inputProps.onBlur = props.onBlur}

  let selectProps = {
    className: "frequency-select",
    noLabel: true,
    noMargin: true,
    id: props.id ? props.id+"-select" : props.name+"-select",
    //name: props.name+"-select"
  };
  if (props.disabled) {selectProps.disabled = props.disabled}
  if (props.readonly) {selectProps.readonly = props.readonly}
  if (props.error) {selectProps.error = props.error}
  selectProps.hideError = true;
  selectProps.required = props.required ? props.required : false;
  if (props.onChange) {selectProps.onChange = props.onChange}
  if (props.onBlur) {selectProps.onBlur = props.onBlur}

  const frequencyOptions = [
    'seconds',
    'minutes',
    'hours',
    'days',
    'weeks',
    'months',
    'years'
  ];

  return (
    <div ref={ref} className={classProps.join(' ')} >
      {props.noLabel? "" : 
        <label className="frequency__label" htmlFor={props.id ? props.id : props.name}>
          {props.label ? props.label : props.name}: {inputProps.required ? <span className="small">[Required]</span> : ""}
        </label>
      }
      {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : "" }
      <Input 
        /*{...register(props.name, { 
          required: inputProps.required, 
          minLength: { value: props.minLength, message: "Please enter more characters"},
          maxLength: { value: props.maxLength, message: "Please enter less characters"},
          }
        )}*/
        {...inputProps}
        />
        <Select options={frequencyOptions} {...selectProps} />
      {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
          <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
        </p> : "" }
      {props.error? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : "" }
      {props.children}
    </div>
  )
}