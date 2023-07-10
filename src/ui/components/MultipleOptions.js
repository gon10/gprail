import React, { useState, useRef } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick'

import Boolean from '../base/Boolean';
import Select from '../base/Select';
import Checkbox from '../base/Checkbox';

export function MultiOptionContainer({register, methods, errors, ...props}) {
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));

  const [thisId] = useState(_uniqueId())
  const id = props.id ? props.id : thisId;

  let containerProps = {
    id: id,
    name: props.name? props.name : "multiple-options-"+id,
    className: props.className,
    required: props.required? props.required : false,
    noLabel: props.noLable? props.noLable : false,
    noMargin: props.noMargin? props.noMargin: false,
    hideError: props.hidError? props.hideError : false,
    fullWidth: props.fullWidth? props.fullWidth : false,
    label: props.label? props.label : null,
    helpText: props.helpText? props.helpText : null,
    children: props.children? props.children : null,
    error: props.error? props.error : null,
    onChange: props.onchange? props.onchange : null,
    onBlur: props.onBlur? props.onBlur : null,
  };

  return (
    <div ref={ref} className={containerProps.className.join(' ')}>
      { containerProps.noLabel? null : 
        <label className="multiple-options__label" htmlFor={containerProps.name}>
          {containerProps.label ? containerProps.label : containerProps.name}: {containerProps.required ? <span className="small">[Required]</span> : ""}
        </label>
      }
      {containerProps.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : "" }
      
      {React.Children.map(props.children, child => {
        //console.log(child.props.type);
        return child.props.name
          ? React.createElement(child.type, {
              ...{
                ...child.props,
                register: register,
                key: child.props.name,
                error: errors,
                valueAsNumber: (child.props.type === "number")? true : false
              }
            })
          : child;
      })}

      {containerProps.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
          <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {containerProps.helpText}
        </p> : null }
      {(containerProps.error && !containerProps.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {containerProps.error.message}</p> : "" }
    </div>
  )
}

export default function MultipleOptions({control, register, methods, errors, ...props}) {
  const [thisId] = useState(_uniqueId())
  const id = props.id ? props.id : thisId;

  let classProps = ['multiple-options__wrap'];
  if (props.disabled) {classProps.push('multiple-options__wrap--disabled')}
  if (props.className) {classProps.push(props.className)}
  if (props.error) {classProps.push('multiple-options__wrap--error')}
  if (props.noLabel) {classProps.push('multiple-options__wrap--no-label')}
  if (props.noMargin) {classProps.push('multiple-options__wrap--no-margin')}

  let containerProps = {
    id: id,
    name: props.name? props.name : "multiple-options-"+id,
    className: classProps,
    required: props.required ? props.required : false,
    disabled: props.disabled? props.disabled : false,
    readOnly: props.readOnly? props.readOnly : false,
    noLabel: props.noLable? props.noLable : false,
    noMargin: props.noMargin? props.noMargin: false,
    hideError: props.hidError? props.hideError : false,
    fullWidth: props.fullWidth? props.fullWidth : false,
    label: props.label? props.label : null,
    helpText: props.helpText? props.helpText : null,
    children: props.children? props.children : null,
    error: props.error? props.error : null,
    onChange: props.onchange? props.onchange : null,
    onBlur: props.onBlur? props.onBlur : null,
    register: register, 
    methods: methods, 
    errors: errors,
  };

  let selectProps = {
    closeMenuOnSelect: props.closeOnSelect ? props.closeOnSelect : false,
    isMulti: props.isMulti? props.isMulti : true,
    isCreatable: props.isCreatable? props.isCreatable : false,
    className: null,
  };

  const options = props.options? props.options : ['no options provided'];

  let content = [];
  switch (props.displayType) {
    case "toggle":
      let toggles = [];
      options.map((option, i) => {
        toggles.push(<Boolean key={i} 
          value={option.value} 
          label={option.label} 
          displayType="toggle" 
          name={props.name} 
          disabled={props.disabled} 
          error={props.error}
          hideError={true}
          inline={true}
          className="multiple-options__option"
        />);
        return null;
      });
      content.push(<MultiOptionContainer key={"booleans-"+id} {...containerProps}>{toggles}</MultiOptionContainer>);
      break
    case "checkbox":
      let checkboxes = [];
      options.map((option, i) => {
        checkboxes.push(<Checkbox key={i} 
          value={option.value} 
          label={option.label} 
          toggle={false} 
          name={props.name} 
          disabled={props.disabled} 
          error={props.error}
          hideError={true}
          className="multiple-options__option"
        />);
        return null;
      });
      content.push(<MultiOptionContainer key={"checkboxes"+id} {...containerProps} radioType="default">{checkboxes}</MultiOptionContainer>);
      break
    case "dropdown":
      content.push(<Select key={"multi-select"+id} options={options} {...containerProps}  {...selectProps} />);
      break
    default:
      content.push(<Select key={"multi-select"+id} options={options} {...containerProps}  {...selectProps} />);
  }

  return (
    <>
      {content}
    </>
  )
}