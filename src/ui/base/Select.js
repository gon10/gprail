import React, { useState, useRef } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { default as MultiSelect} from 'react-select';
import AsyncSelect from 'react-select/async';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick'
import { changeValueByPath } from '../../Helpers/utils';

export default function Select({register, methods, errors, ...props}) {
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));

  const [thisId] = useState(_uniqueId())
  const id = props.id ? props.id : thisId;

  const animatedComponents = makeAnimated();

  const options = props.options? props.options : [];
  const useOptions = (Array.isArray(options)) ? 
    options.map( (opt) => {
      if (typeof opt === "string") {
        return({ value: opt, label: opt });
      } else if (typeof opt === "object") {
        return(opt);
      } else {
        return("Error reading select options.");
      }
    })
   : Object.entries(options).map((optval) => {
      return({ value: optval[0], label: optval[1] })
    });  

    
  let classProps = ['select__wrap'];
  if (props.disabled) {classProps.push('select__wrap--disabled')}
  if (props.noLabel) {classProps.push('select__wrap--no-label')}
  if (props.noMargin) {classProps.push('select__wrap--no-margin')}
  if (props.className) {
    if (typeof props.className === "object") {
      classProps.push(props.className.join(' '))
    } else {
      classProps.push(props.className)
    }
  }
 

  let inputProps = {
    className: "multi-select",
    required: props.required ? props.required : false,
    isDisabled: props.disabled? props.disabled : false,
    readOnly: props.readOnly? props.readOnly : false,
    id: id,
    value: props.value? props.value : undefined,
    inputValue: props.inputValue? props.inputValue : undefined,
    name: props.name? props.name : "select-"+id,
    defaultValue: props.defaultValue? props.defaultValue : undefined,
    defaultInputValue: props.defaultInputValue? props.defaultInputValue : undefined,
    placeholder: props.placeholder? props.placeholder : "Select...",
    closeMenuOnSelect: props.closeOnSelect ? props.closeOnSelect : true,
    components: animatedComponents,
    classNamePrefix: "select",
    isMulti: props.isMulti? props.isMulti : false,
    isClearable: props.isClearable? props.isClearable : undefined,
    options: useOptions,
    filterOption: props.filterOption? props.filterOption : props.defaultValue? false : undefined,
    isLoading: props.isLoading || undefined,
    //unstyled: true
  };
  
  if (props.error) {inputProps.error = props.error}
  if (props.onChange) {inputProps.onChange = props.onChange}
  if (props.onInputChange) {inputProps.onInputChange = props.onInputChange}
  if (props.onBlur) {inputProps.onBlur = props.onBlur}
  if (props.isSearchable) {inputProps.isSearchable = props.isSearchable}
  if (props.onInputChange) {inputProps.onInputChange = props.onInputChange}
  if (props.inputValue) {inputProps.inputValue = props.inputValue}
  if (props.controlShouldRenderValue) {inputProps.controlShouldRenderValue = props.controlShouldRenderValue}

  function multiSelectOnChange(val){
    if(methods){
      let value = val.value;
      if(Number(val.value)){
        value = Number(val.value)
      }

      let copy = global.structuredClone(methods.getValues());
      changeValueByPath(copy, props.name, value);
      if(props.additionalNameToChange){
        changeValueByPath(copy, props.additionalNameToChange, value);
      }
      props.setData(copy);
      
    }
  }

  let value = undefined
  if(methods){
    if(props.name.includes("speed")){
      let val =methods.getValues(props.name);
      if(val){
        value = { value: val, label:`${val} mph` };
      }

        methods.register(props.name, { value: val, required: props.required })
    }
    else {
      value = methods.getValues(props.name) ?  { value: `${methods.getValues(props.name)}`, label:`${methods.getValues(props.name)}` } : props.displayType === "async" ? []: "";      
        methods.register(props.name, { value: value, required: props.required, minLength: 1 }) 
    }
  }
  if(props.rhf){
    inputProps.value = value;
    inputProps.onChange = multiSelectOnChange
  }

  return (
    <div ref={ref} className={classProps.join(' ')}>
      { props.noLabel? "" : 
        <label className="select__label" htmlFor={props.name}>
          {props.label ? props.label : props.name}: {inputProps.required ? <span className="small">[Required]</span> : ""}
        </label>
      }
      {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : "" }
      
      { props.isCreatable? <CreatableSelect isClearable {...inputProps} /> : 
        props.displayType === "async" ? <AsyncSelect loadOptions={props.loadOptions} defaultOptions 
        value={inputProps.value}
        isMulti
        onChange={props.onChange}
        isDisabled={props.disabled}
        />  
        : <MultiSelect {...inputProps} 
          
        />}
      
      {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
          <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
        </p> : "" }
      {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message?  props.error.message : props.error.type === "required" ? "This input is required": props.error.type }</p> : "" }
      {props.children}
    </div>
  );
};