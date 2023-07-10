import React, { useState, useRef } from 'react';
import { faInfoCircle, faExclamationTriangle, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick';
import Button from '../base/Button';

export default function FieldArray({ control, register, methods, errors, ...props }) {
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));
  const RepeatElement = props.repeatElement;
  const initialRepeats = props.initialRepeats? props.initialRepeats : 3;
  const [repeats, setRepeats] = useState([...Array(initialRepeats).keys()]);

  let allValues = methods.getValues();

  let repeatProps = props.repeatProps
  repeatProps.control = control
  repeatProps.register = register
  repeatProps.methods = methods
  repeatProps.errors = errors

  let classProps = ['field-array__wrap'];
  if (props.disabled) {
    classProps.push('field-array__wrap--disabled');
    repeatProps.disabled = true;
  }
  if (props.required) {
    classProps.push('field-array__wrap--required');
    repeatProps.required = true;
  }
  if (props.error) {
    classProps.push('field-array__wrap--error');
    repeatProps.error = true;
    repeatProps.hideError = true;
  }

  if (props.className) {classProps.push(props.className)}
  if (props.noLabel) {classProps.push('field-array__wrap--no-label')}
  if (props.noMargin) {classProps.push('field-array__wrap--no-margin')}
  if (props.condensed) {classProps.push('field-array__wrap--condensed')}

  let noTitle = props.noTitle ? true : false;
  if (props.noLabel) {noTitle = true}

  function onRemove(id, e) {
    e.stopPropagation();
    e.preventDefault();
    let itemToRemove = repeats.indexOf(id);

    let valuesToChange = global.structuredClone(methods.getValues());

    valuesToChange.documents[props.index].aliases.splice(id, 1);
    methods.unregister(props.name,{ keepDirty: true });
    methods.register(props.name,{ value: valuesToChange.documents[props.index].aliases  });
    allValues= methods.getValues();

    if(repeats.length > 1){
      let repeatsArray = [...repeats];
      repeatsArray.splice(itemToRemove, 1);
      setRepeats(repeatsArray)
    }
  }

  let parentFieldName = repeatProps.name.split("[")[0]
  function onAdd(e) {
    e.stopPropagation();
    e.preventDefault();
    setRepeats(curr=>[...curr, curr[curr.length-1]+1])
    const boundFieldNameValue = allValues[parentFieldName][props.index][props.field.boundFieldName]
    const toRegister =  boundFieldNameValue
      ? `${repeatProps.name}.${[boundFieldNameValue.length]}`
      : `${repeatProps.name}.${[0]}` 
    register(toRegister, { value: "" })
    allValues= methods.getValues();
  }

  let content = [];
  if(allValues[parentFieldName] && allValues[parentFieldName][props.index] && allValues[parentFieldName][props.index][props.field.boundFieldName]){
    for (let i = 0; i < allValues[parentFieldName][props.index][props.field.boundFieldName].length; i++) {

      content.push(<div key={i} className="field-array__content__item">
        <RepeatElement 
        {...repeatProps} 
        name={repeatProps.name+"["+i+"]"} />
        <Button 
          action="secondary" 
          disabled={repeats.length <= 1 || props.disabled} 
          className={props.error? "button--warning" : ""}
          onClick={props.disabled || repeats.length <= 1 ? null : (e) => onRemove(i, e)}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </Button>
      </div>    
      );
    }
  }

  return (
    <div ref={ref} className={classProps.join(' ')}>
      {noTitle ? "" : 
        <>
          <label className="field-array__label" htmlFor={props.id ? props.id : props.name}>
            {props.label ? props.label : props.name}: {props.required ? <span className="small">[Required]</span> : ""}
          </label>
          {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : "" }
        </>
      }
      {props.condensed? <>
          {content}
          <Button action="secondary" 
            onClick={props.disabled ? null : (e) => onAdd(e)}
            disabled={props.disabled} 
            className={props.error? "button--warning" : ""}>
            <FontAwesomeIcon icon={faPlus} /> Add item
          </Button>
        </> : 
        <div className="field-array__content">
          {content}
        </div>
      }
      <div className="field-array__footer">
        <div className="field-array__messages">
          {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
              <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
            </p> : "" }
          {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : "" }
        </div>
        {props.condensed? null:  <div className="field-array__controls">
          <Button action="secondary" 
            onClick={props.disabled ? null : (e) => onAdd(e)}
            disabled={props.disabled} 
            className={props.error? "button--warning" : ""}>
            <FontAwesomeIcon icon={faPlus} /> Add Row
          </Button>
        </div>}
      </div>
      {props.children}
    </div>
  )
}