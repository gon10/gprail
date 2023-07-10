import React, { useState, useRef } from 'react';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick'

export default function RadioGroup({register, methods, errors, ...props}) {
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));

  let wrapProps = ['radio-group__wrap'];
  if (props.disabled) {wrapProps.push('radio-group__wrap--disabled')}
  if (props.className) {
    if (typeof props.className === "object") {
      wrapProps.push(props.className.join(' '))
    } else {
      wrapProps.push(props.className)
    }
  }
  if (props.error) {wrapProps.push('radio-group__wrap--error')}
  if (props.noLabel) {wrapProps.push('radio-group__wrap--no-label')}
  if (props.noMargin) {wrapProps.push('radio-group__wrap--no-margin')}
  if (props.fullWidth) {wrapProps.push('radio-group__wrap--full-width')}

  const radioType = props.radioType ? props.radioType : "default";
  let classProps = ["radio-group"];
  if (props.disabled) {classProps.push("radio-group--disabled")};
  if (props.error) {classProps.push("radio-group--error")};

  const groupLabel = props.label ? 
  <label className="radio-group__label"> 
    { props.label} {props.required ? <span className="small">[Required]</span>  : ""} 
    { props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : "" }
  </label> : "";

  switch (radioType) {
    case "toggle":
      classProps.push("radio-group--toggle");
      break;
    case "buttons":
      classProps.push("radio-group--buttons");
      break;
    default:
      classProps.push("radio-group--default");
  }

  if(methods){
    let value = methods.getValues(props.name)
    let required = props.required
    
    methods.register(props.name, { value: value, required: required, minLength: 1 }) 

      // 
  }

  return (
  <div ref={ref} className={wrapProps.join(' ')}>
    {groupLabel}
    <div className={classProps.join(' ')} >
      {React.Children.map(props.children, child => {
          //console.log(child.props.type);
          return child.props.name
            ? React.createElement(child.type, {
                ...{
                  ...child.props,
                  register: register,
                  key: child.props.name,
                  error: errors,
                  methods: methods,
                  valueAsNumber: (child.props.type === "number")? true : false
                }
              })
            : child;
        })}
    </div>
    {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
      <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
    </p> : "" }
    {props.error? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : "" }
  </div>
  )
};