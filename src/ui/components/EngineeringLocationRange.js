import React, { useState, useRef } from 'react'
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import OutsideClick from '../../Helpers/OutsideClick'
import EngineeringLocation from './EngineeringLocation'
import LocationUnitsToggle from './LocationUnitsToggle'
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { Button } from '../base'
import getPropertyByPath from '../../Helpers/utils'

export default function EngineeringLocationRange({ register, methods, errors, ...props }) {
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));

  let classProps = ['elr-range__wrap'];
  if (props.disabled) {classProps.push('elr-range__wrap--disabled')}
  if (props.className) {classProps.push(props.className)}
  if (props.error) {classProps.push('elr-range__wrap--error')}
  if (props.noLabel) {classProps.push('elr-range__wrap--no-label')}
  if (props.noMargin) {classProps.push('elr-range__wrap--no-margin')}

  let unitProps = {
    disabled: props.disabled, 
    readonly: props.readonly,
    error: props.error,
    required: props.required,
  }

  let fromProps = {
    //className: props.className? "elr-range__from "+props.className : "elr-range__from",
    className: "elr-range__from",
    label: "Location from",
    noLabel: props.noLabel? true: false,
    noMargin: true,
    noTitle: true,
    elrLabel: "ELR from",
    hideError: true,
    trackId: props.trackId? true : false,
    disabled: props.disabled, 
    readonly: props.readonly,
    error: props.error,
    required: props.required,
    onChange: props.onChange,
    onBlur: props.onBlur,
    singleField: props.singleField,
    register: register,
    methods: methods,
    errors: errors,
  };

  let toProps = {
    //className: props.className? "elr-range__to "+props.className : "elr-range__to",
    className: "elr-range__to",
    label: "Location to",
    noLabel: props.noLabel? true: false,
    noMargin: true,
    noTitle: true,
    elrLabel: "ELR to",
    hideError: true,
    trackId: props.trackId? true : false,
    disabled: props.disabled, 
    readonly: props.readonly,
    error: props.error,
    required: props.required,
    onChange: props.onChange,
    onBlur: props.onBlur,
    singleField: props.singleField,
    register: register,
    methods: methods,
    errors: errors,
  };

  if (!props.inlineUnits) {
    fromProps.noUnits = true;
    toProps.noUnits = true;
  }

  let noTitle = props.noTitle ? true : false;
  if (props.noLabel) {noTitle = true}

  let hideUnits = props.hideUnitsForRepeatedElements && (props.index > 0 || props.i > 0)


  const removeRow = (e) => {
      e.preventDefault(); 
      let dataObj = global.structuredClone(methods.getValues());
      let value = getPropertyByPath(dataObj, props.name);
      value.remove();
      props.setData(dataObj);
  }


  return (
    <div ref={ref} className={classProps.join(' ')}>
      {noTitle ? "" : 
        <label className="elr-range__label" htmlFor={props.id ? props.id : props.name}>
          {props.label ? props.label : props.name}: {props.required ? <span className="small">[Required]</span> : ""}
        </label>
      }
      {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : "" }
      
      {props.inlineUnits? null : hideUnits ? undefined : <LocationUnitsToggle {...unitProps} />}

      <EngineeringLocation name={`${props.name}.from`} additionalNameToChange={`${props.name}.to`}  {...fromProps} 
      setData={props.setData} data={props.data} trackId
      />

      <EngineeringLocation name={`${props.name}.to`} elrDisabled {...toProps} setData={props.setData} trackId
      />

      {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
          <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
        </p> : "" }
      {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : "" }
      {props.children}
      <Button action="secondary" disabled={!props.canRemoveRow} className={`${props.error? "button--warning" : ""} button__remove-row`}
              onClick={removeRow} 
        >
          <FontAwesomeIcon icon={faTrashAlt} />
      </Button>

    </div>
  )
}