import React, { useEffect, useState } from 'react'
import Input from '../base/InputRhf';
import _uniqueId from 'lodash/uniqueId';
import SingleOption from './SingleOption';
import { useRef } from 'react';
import OutsideClick from '../../Helpers/OutsideClick'
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { changeValueByPath } from '../../Helpers/utils';


export function DurationField(props) {
    const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  const [thisId] = useState(_uniqueId())
  const id = /*props.id ? props.id :*/ thisId;

  OutsideClick(ref, () => setShowHelp(false));

  let hasError = "";
  // if (props.methods && props.methods.getFieldState && props.methods.getFieldState(props.name) && props.methods.getFieldState(props.name).error) {
  //   hasError = props.methods.getFieldState(props.name).error
  // }
  // console.log('hasError', hasError)

  // let hasError = props.error;

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
        //  {...props.register(props.name, {
        //   required: inputProps.required,
        //   // minLength: { value: props.minLength, message: "Please enter more characters" },
        //   // maxLength: { value: props.maxLength, message: "Please enter less characters" },
        //   // type: props.type ? props.type : "text",
        //   // valueAsNumber: (props.type === "number") ? true : false,
        //   //valueAsDate: (props.type === "datetime-local")? true : false,
        //   validate: props.validationObj,
        // }
        // )}
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
        fullWidth: true,
        setData: props.setData ? props.setData : null,
        required:true
    };

    let durationHrsInputProps = {
        name: props.name+"[0].schedule.duration",
        label: "Duration (hours)",
        id: id+"durationHours",
        type: "number",
        className: classProps,
        required: true,
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
        required: true,
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
        fullWidth: true,
        disabled: true
    };

    let validationObj = {};
    validationObj.isBefore = (duration) => {
      console.log('duration isbefore...', duration)
      if (!duration) {
        return false;
      }
      return true;
    };

    useEffect(() => {
      let values;
      if(methods){
        values = methods.getValues();
      if(!methods.getValues(`${props.name}[0].schedule.duration`)){
        changeValueByPath(values, `${props.name}[0].schedule.duration`, "P0H0M");
      }
      if(!methods.getValues(`${props.name}[0].type`)){
        changeValueByPath(values, `${props.name}[0].type`, "ad-hoc");
      }

      props.setData(values);
    }
    }, [])
    

    let durationVal;
    if(methods){
      durationVal=methods.getValues(`${props.name}[0].schedule.duration`);
      
    }


  
    let startDateVal
      if(methods){
        startDateVal=methods.getValues(`${props.name}[0].schedule.start`);
      }
      console.log("startDateVal", startDateVal)
    const handleHoursChange = (event) => {
      let hours = event.target.value.replace(/^0/, '');
      if (isNaN(hours) || hours < 0) {
        hours = 0;
      }
      let duration;
      if(methods){
        duration=methods.getValues(`${props.name}[0].schedule.duration`) || "P0H0M";

      }
      const updatedDuration = duration.replace(/(\d*)H/, `${hours}H`);
      let values = methods.getValues();
      changeValueByPath(values, `${props.name}[0].schedule.duration`, updatedDuration);
      
      const match = updatedDuration.match(/(\d+)H(\d+)M/);
      if (match && startDateVal) {
        const hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const updatedEndDateTime = new Date(startDateVal);
        updatedEndDateTime.setHours(updatedEndDateTime.getHours() +1  + hours);
        updatedEndDateTime.setMinutes(updatedEndDateTime.getMinutes() + minutes);
        changeValueByPath(values, `${props.name}[0].schedule.end`, updatedEndDateTime.toISOString().slice(0, -1));
        changeValueByPath(values, `dateCompletedBy`, updatedEndDateTime.toISOString().slice(0, -1));
      }
      props.setData(values);
    };
  
    const handleMinutesChange = (event) => {
      let minutes = event.target.value.replace(/^0/, '');
      if (isNaN(minutes) || minutes < 0) {
        minutes = 0;
      } else if (minutes > 59) {
        minutes = 59;
      }
      let duration;
      
      if(methods){
        duration=methods.getValues(`${props.name}[0].schedule.duration`)  || "P0H0M";
      }
      const updatedDuration = duration.replace(/(\d*)M/, `${minutes}M`);
      let values = methods.getValues();
      changeValueByPath(values, `${props.name}[0].schedule.duration`, updatedDuration);
      let startDateVal
      if(methods){
        startDateVal=methods.getValues(`${props.name}[0].schedule.start`);
      }
      const match = updatedDuration.match(/(\d+)H(\d+)M/);
      if (match) {
        const hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const updatedEndDateTime = new Date(startDateVal);
        updatedEndDateTime.setHours(updatedEndDateTime.getHours() +1 + hours);
        updatedEndDateTime.setMinutes(updatedEndDateTime.getMinutes() + minutes);
        changeValueByPath(values, `${props.name}[0].schedule.end`, updatedEndDateTime.toISOString().slice(0, -1));
        changeValueByPath(values, `dateCompletedBy`, updatedEndDateTime.toISOString().slice(0, -1));
      }
      props.setData(values);
    };
  
    const extractHours = () => {
      const match = durationVal ? durationVal.match(/(\d+)H/) : null;
      return match ? match[1] : '0';
    };
  
    const extractMinutes = () => {
      const match = durationVal ? durationVal.match(/(\d+)M/) : null;
      return match ? match[1] : '0';
    };

    useEffect(() => {
      if(methods){
        console.log('register...durationVal', durationVal)
        register(`${props.name}[0].schedule.duration`, {value:durationVal, validate: validationObj });
        let error = methods.getFieldState(`${props.name}[0].schedule.duration`);
        console.log('error', error)
        if(!error.error && extractHours()===0 && extractMinutes()===0){
          methods.setError(`${props.name}[0].schedule.duration`, { "type":"type", "message":"message" });
        }
      }
    })

    // let durationValidationObj = {};

    // durationValidationObj.hasDuration = value => {console.log('value',props.name, value); if(!extractHours() && !extractMinutes()) {return "Please define a duration"} else return true}

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
        // defaultValue={{label: "Ad-hoc", value: "ad-hoc"}}
        setData={props.setData}
        required 
        />
      <Input
          {...startDateTimeInputProps}
      />
      <DurationField
          {...durationHrsInputProps}
          value={extractHours()}
          onChange={handleHoursChange}
          // validationObj={durationValidationObj}
          disabled={startDateVal ? false : true} 
      />
      <DurationField
          {...durationMinsInputProps}
          value={extractMinutes()}
          onChange={handleMinutesChange}
          // validationObj={durationValidationObj}
          disabled={startDateVal ? false : true} 
      />
      <Input
          {...endDateTimeInputProps}
      />
    </>
  )
}
