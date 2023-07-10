import React, { useState, useRef } from 'react';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick'
import _uniqueId from 'lodash/uniqueId';

export default function Checkbox({register, ...props}) { 
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));
  const id = _uniqueId(props.name+'__'+props.value);

  let classProps = ['checkbox__wrap'];
  if (props.disabled) {classProps.push('checkbox__wrap--disabled')}
  if (props.error) {classProps.push("checkbox__wrap--error")};
  if (props.right) {classProps.push("checkbox__wrap--right")};
  if (props.className) {classProps.push(props.className)}

  return (
    <div ref={ref} className={classProps.join(' ')}>
      <input 
        {...register(props.name, { 
          required: props.required, 
          minLength: { value: props.minLength, message: "Please enter more characters"},
          maxLength: { value: props.maxLength, message: "Please enter less characters"},
          }
        )}
        className="checkbox" type="checkbox" name={props.name} value={props.value} 
        id={id} checked={props.checked} onChange={props.onChange} disabled={props.disabled} 
        />
      <label className="checkbox__label" htmlFor={id}>
        { props.label ? props.label : "" }
        { props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : "" }
      </label>
      {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
        <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
      </p> : "" }
      {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : "" }
    </div>
  )
};
