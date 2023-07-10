import React, { useState } from 'react'
import Input from '../base/InputRhf';
import _uniqueId from 'lodash/uniqueId';
import { DateTimeRangeWrap } from './DateTimeRange';
import SingleOption from './SingleOption';
import { useRef } from 'react';
import OutsideClick from '../../Helpers/OutsideClick'
import { faSearch, faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { changeValueByPath } from '../../Helpers/utils';


export function DurationField(props) {
    const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  const [isUnique, setIsUnique] = useState(true);
  const [thisId] = useState(_uniqueId())
  const id = /*props.id ? props.id :*/ thisId;

  OutsideClick(ref, () => setShowHelp(false));

  let hasError = props.error;

    let classProps = ['input__wrap'];
    if (props.disabled) { classProps.push('input__wrap--disabled') }
    if (props.readonly) { classProps.push('input__wrap--disabled') }
    if (props.className) { classProps.push(props.className) }
    if (!hasError && props.error && props.error.message) { classProps.push('input__wrap--error') }
    if (hasError) { classProps.push('input__wrap--error') }
    if (props.noLabel) { classProps.push('input__wrap--no-label') }
    if (props.noMargin) { classProps.push('input__wrap--no-margin') }
    if (props.type === "search") { classProps.push('input__wrap--search') }
    if (props.fullWidth) { classProps.push('input__wrap--full-width') }
  
    let inputProps = {
      className: (props.type === "search") ? "input search" : "input",
      type: props.type ? props.type : "text",
      id: id,
      name: props.name,
      min: props.min,
      max: props.max,
      step: props.step,
      disabled: props.disabled,
      readOnly: props.readOnly,
      required: props.required? props.required : false,
      minLength: props.minLeangth,
      maxLength: props.maxLength,
      placeholder: props.placeholder,
      accept: props.accept,
      value: props.value,
      onChange: props.onChange
    };
  return (
    <div ref={ref} className={classProps.join(' ')} >
      {props.noLabel ? "" :
        <label className="input__label" htmlFor={inputProps.id}>
          {props.label ? props.label : props.name}: {inputProps.required ? <span className="small">[Required]</span> : ""}
        </label>
      }
      {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : ""}
        <input
         
          {...inputProps}
        />
      {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
        <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
      </p> : ""}
      {(!hasError && props.error && props.error.message && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : ""}
      {(hasError && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {hasError.message ? hasError.message : hasError.type === "required" ? "This input is required" : hasError.type}</p> : ""}
      {props.children}
    </div>
  )
}



export default function ShiftsField({ control, register, methods, errors, ...props }) {
    const [thisId] = useState(_uniqueId())
    const id = props.id ? props.id : thisId;

    let classProps = ['date-time-range__wrap'];
    if (props.disabled) { classProps.push('date-time-range__wrap--disabled') }
    if (props.className) { classProps.push(props.className) }
    if (props.error) { classProps.push('date-time-range__wrap--error') }
    if (props.noLabel) { classProps.push('date-time-range__wrap--no-label') }
    if (props.noMargin) { classProps.push('date-time-range__wrap--no-margin') }

    let inputProps = {
        noMargin: true,
        hideError: true,
        register: register,
        methods: methods,
        errors: errors,
      };
      if (props.disabled) {inputProps.disabled = props.disabled}
      if (props.readonly) {inputProps.readonly = props.readonly}
      if (props.error) {inputProps.error = props.error}
      inputProps.required = props.required ? props.required : false;
      if (props.placeholder) {inputProps.placeholder = props.placeholder}
      if (props.onChange) {inputProps.onChange = props.onChange}
      if (props.onBlur) {inputProps.onBlur = props.onBlur}

    let startDateTimeInputProps = {
        name: props.name+"[0].schedule.start",
        label: "Start Date and Time",
        id: id+"start",
        type: "datetime-local",
        className: classProps,
        required: props.required ? props.required : false,
        disabled: props.disabled ? props.disabled : false,
        readOnly: props.readOnly ? props.readOnly : false,
        noLabel: props.noLabel ? props.noLabel : false,
        noMargin: props.noMargin ? props.noMargin : false,
        hideError: props.hidError ? props.hideError : false,
        helpText: props.helpText ? props.helpText : null,
        children: props.children ? props.children : null,
        error: props.error ? props.error : null,
        onChange: props.onchange ? props.onchange : null,
        onBlur: props.onBlur ? props.onBlur : null,
        control: control,
        register: register,
        methods: methods,
        errors: errors,
        fullWidth: true
    };

    let durationHrsInputProps = {
        name: props.name+"[0].schedule.duration",
        label: "Duration (hours)",
        id: id+"durationHours",
        type: "number",
        className: classProps,
        required: props.required ? props.required : false,
        disabled: props.disabled ? props.disabled : false,
        readOnly: props.readOnly ? props.readOnly : false,
        noLabel: props.noLabel ? props.noLabel : false,
        noMargin: props.noMargin ? props.noMargin : false,
        hideError: props.hidError ? props.hideError : false,
        fullWidth: props.fullWidth ? props.fullWidth : false,
        helpText: props.helpText ? props.helpText : null,
        children: props.children ? props.children : null,
        error: props.error ? props.error : null,
        onChange: props.onchange ? props.onchange : null,
        onBlur: props.onBlur ? props.onBlur : null,
        control: control,
        register: register,
        methods: methods,
        errors: errors,
    };

    let durationMinsInputProps = {
        name: props.name+"[0].schedule.duration",
        label: "Duration (mins)",
        id: id+"durationMins",
        type: "number",
        className: classProps,
        required: props.required ? props.required : false,
        disabled: props.disabled ? props.disabled : false,
        readOnly: props.readOnly ? props.readOnly : false,
        noLabel: props.noLabel ? props.noLabel : false,
        noMargin: props.noMargin ? props.noMargin : false,
        hideError: props.hidError ? props.hideError : false,
        fullWidth: props.fullWidth ? props.fullWidth : false,
        helpText: props.helpText ? props.helpText : null,
        children: props.children ? props.children : null,
        error: props.error ? props.error : null,
        onChange: props.onchange ? props.onchange : null,
        onBlur: props.onBlur ? props.onBlur : null,
        control: control,
        register: register,
        methods: methods,
        errors: errors,
    };

   

    let endDateTimeInputProps = {
        name: props.name+"[0].schedule.end",
        label: "End Date and Time",
        id: id+"end",
        type: "datetime-local",
        className: classProps,
        required: props.required ? props.required : false,
        disabled: props.disabled ? props.disabled : false,
        readOnly: props.readOnly ? props.readOnly : false,
        noLabel: props.noLabel ? props.noLabel : false,
        noMargin: props.noMargin ? props.noMargin : false,
        hideError: props.hidError ? props.hideError : false,
        helpText: props.helpText ? props.helpText : null,
        children: props.children ? props.children : null,
        error: props.error ? props.error : null,
        onChange: props.onchange ? props.onchange : null,
        onBlur: props.onBlur ? props.onBlur : null,
        control: control,
        register: register,
        methods: methods,
        errors: errors,
        fullWidth: true
    };

    let durationVal;
    if(methods){
      durationVal=methods.getValues(`${props.name}[0].schedule.duration`);
    }
    console.log('`${props.name}[0].schedule.duration`', `${props.name}[0].schedule.duration`)
    console.log("durationVal", durationVal)

  
    const handleHoursChange = (event) => {
      const hours = event.target.value;
      let dur;
      if(methods){
        dur=methods.getValues(`${props.name}[0].schedule.duration`);
      }
      const updatedDuration = dur.replace(/(\d+)H/, `${hours}H`);
      let values = methods.getValues();
      changeValueByPath(values, `${props.name}[0].schedule.duration`, updatedDuration);
      props.setData(values);
    };
  
    const handleMinutesChange = (event) => {
      const minutes = event.target.value;
      
      if (isNaN(minutes) || minutes < 0) {
        console.log('minutes', minutes);
      console.log('      isNaN(minutes)',       isNaN(minutes))
        minutes = 0;
      } else if (minutes > 59) {
        minutes = 59;
      }
      let duration;
      
      if(methods){
        duration=methods.getValues(`${props.name}[0].schedule.duration`);
      }
      const updatedDuration = duration.replace(/(\d+)M/, `${minutes}M`);
      let values = methods.getValues();
      changeValueByPath(values, `${props.name}[0].schedule.duration`, updatedDuration);
      props.setData(values);
    };

    const handleUpdateEndDate = () => {
      let startDateVal, duration;
      if(methods){
        startDateVal=methods.getValues(`${props.name}[0].schedule.start`);
        duration=methods.getValues(`${props.name}[0].schedule.duration`);
      }
  
      const match = duration.match(/(\d+)H(\d+)M/);
      if (match) {
        const hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const updatedEndDateTime = new Date(startDateVal);
        updatedEndDateTime.setHours(updatedEndDateTime.getHours() + hours);
        updatedEndDateTime.setMinutes(updatedEndDateTime.getMinutes() + minutes);
  
        let values = methods.getValues();
        changeValueByPath(values, `${props.name}[0].schedule.end`, updatedEndDateTime);
        props.setData(values);
      }
    };
  
    const extractHours = () => {
      const match = durationVal.match(/(\d+)H/);
      return match ? match[1] : '0';
    };
  
    const extractMinutes = () => {
      const match = durationVal.match(/(\d+)M/);
      return match ? match[1] : '0';
    };

  return (
    <>
      <SingleOption
        displayType="toggle" 
        className="" 
        label="" 
        fullWidth 
        {...inputProps}
        name={`${props.name}[0].type`}
        disabled={inputProps.disabled} 
        // onChange={(e) => onChangeValues(e)} 
        options={[
          {label: "Ad-hoc", value: "ad-hoc"},
          {label: "Repeat", value: "Repeat"},
        ]}
        setData={props.setData}
      //   required 
        />
      <Input
          {...startDateTimeInputProps}
      />
      <DurationField
          {...durationHrsInputProps}
          value={extractHours()}
          onChange={handleHoursChange}
      />
      <DurationField
          {...durationMinsInputProps}value={extractMinutes()}
          onChange={handleMinutesChange}
      />
      <Input
          {...endDateTimeInputProps}
      />
    </>
  )
}
