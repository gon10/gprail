import React, { useState, useRef, useEffect } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { faSearch, faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick'
import Button from './Button'
import { propertyUnique } from '../../Service/DocumentService';
import { changeValueByPath } from '../../Helpers/utils';
export default function Input({ register, ...props }) {
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  const [isUnique, setIsUnique] = useState(true);
  const [thisId] = useState(_uniqueId())
  const id = /*props.id ? props.id :*/ thisId;

  OutsideClick(ref, () => setShowHelp(false));
  let result = JSON.stringify(props.error, function (key, val) {
    if (key !== "ref")
      return val;
  });
  
  let value = "";
  if (props.methods && props.methods.getValues) {
    value = props.methods.getValues(props.name)
  }

  const isUniqueOnTable = (value) => {
    let occurrences = 0;
    if (props.methods && props.methods.getValues) {
      let allValuesName = props.name.split("[").at(0);
      let allValues = props.methods.getValues(allValuesName);
      if (Array.isArray(allValues)) {
        allValues.forEach(element => {
          if (element[props.name.split(".").at(-1)] === value) {
            occurrences++
          }
        });
      }
    }
    if (occurrences >= 2) {
      return false;
    } else {
      return true;
    }
  }

  // useEffect(() => {
  //  if(props.val){
  //   register(props.name, { value: props.val })
  //  }
  // }, [])
  
  useEffect(() => {
    async function trigger() {
      if (props.methods && props.methods.trigger) {
        await props.methods.trigger(props.name);
      }
    }
    
    trigger();
  }, [result, value])

  let hasError = "";
  if (props.methods && props.methods.getFieldState && props.methods.getFieldState(props.name) && props.methods.getFieldState(props.name).error) {
    hasError = props.methods.getFieldState(props.name).error
  }

  async function checkIsUnique(value){
    let result = await propertyUnique(props.apiCollectionName, props.name, value, props.id)
    if(result.data.success){
      setIsUnique(false)
    }
    else{
      setIsUnique(true)
    }

  }

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
  };

  if (props.onClick) { inputProps.onClick = props.onClick }
  if (props.onChange) { inputProps.onChange = props.onChange }
  if (props.onBlur) { inputProps.onBlur = props.onBlur }
  if (props.numRows) {
    inputProps.rows = props.numRows;
    inputProps.label = props.label ? props.label : "";
  }

  const onSearch = props.onSearch ? props.onSearch : "";

  let validationObj = {};
  if (props.isUniqueOnTable) {
    validationObj.isUniqueOnTable = value => { if(!isUniqueOnTable(value)) {return "This value must be unique"} else return true}
  }

  if((props.isUnique)){
    validationObj.isUnique = value => { if(!isUnique) {return "This value must be unique"} else return true}
  }
  if (props.dataLessThan) {
    validationObj.dataLessThan = value => { if (value && props.methods.getValues(props.dataLessThan) && value > props.methods.getValues(props.dataLessThan)) { return "Invalid Date. Please try again" } else return true }
  }
  if (props.dataMoreThan) {
    validationObj.dataMoreThan = value => { if (value && props.methods.getValues(props.dataMoreThan) && value < props.methods.getValues(props.dataMoreThan)) { return "Invalid Date. Please try again" } else return true }
  }

  if(props.min !== null && props.min !== undefined){
    validationObj.min = value => { if(value < props.min) {return "This value must be bigger or equal than "+props.min} else return true}
  }
  if(props.checkLineNameUniqueness){
    validationObj.isUniqueOnTable = value => { if(!props.checkLineNameUniqueness(value, props.index)) {return "Line name must be unique"} else return true}
    
  }

  function onChange(e) {
    let value = e.target.value
    if(props.isUnique ) {checkIsUnique(value)}
    
    if(props.methods && props.setData){
      let copy = global.structuredClone(props.methods.getValues());
      changeValueByPath(copy, props.name, value);
      props.setData(copy);
    }
  }

  useEffect(() => {
    if(props.value) {
      checkIsUnique(props.value)
    }
  }, [props.value])

  useEffect(() => {
    if(props.value) {
      checkIsUnique(props.value)
    }
  }, [props.value])

  return (
    <div ref={ref} className={classProps.join(' ')} >
      {props.noLabel ? "" :
        <label className="input__label" htmlFor={inputProps.id}>
          {props.label ? props.label : props.name}: {inputProps.required ? <span className="small">[Required]</span> : ""}
        </label>
      }
      {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : ""}
      {props.numRows ?
        <textarea
          {...register(props.name, {
            required: inputProps.required,
            minLength: { value: props.minLength, message: "Please enter more characters" },
            maxLength: { value: props.maxLength, message: "Please enter less characters" },
            type: props.type ? props.type : "text",
            valueAsNumber: (props.type === "number") ? true : false,
          }
          )}
          {...inputProps}>{props.children}</textarea> :
        <input
          {...register(props.name, {
            required: inputProps.required,
            minLength: { value: props.minLength, message: "Please enter more characters" },
            maxLength: { value: props.maxLength, message: "Please enter less characters" },
            type: props.type ? props.type : "text",
            valueAsNumber: (props.type === "number") ? true : false,
            //valueAsDate: (props.type === "datetime-local")? true : false,
            validate: validationObj,
            onChange: (e) => {onChange(e)}
          }
          )}
          {...inputProps}
        />}
      {(props.type === "search") ? <Button action="primary" className="input__search-button" onClick={onSearch}>
        <FontAwesomeIcon icon={faSearch} className="input__icon" />
      </Button> : ""}
      {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
        <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
      </p> : ""}
      {(!hasError && props.error && props.error.message && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : ""}
      {(hasError && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {hasError.message ? hasError.message : hasError.type === "required" ? "This input is required" : hasError.type}</p> : ""}
      {props.children}
    </div>
  )
}