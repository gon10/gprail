import React, { useState, useRef } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { faInfoCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick';
import Button from '../base/Button';
import getPropertyByPath from '../../Helpers/utils';

export default function Repeater(props) {
  const ref = useRef();
  const [thisId] = useState(_uniqueId())
  const id = props.id ? props.id : thisId;
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));

  const RepeatElement = props.repeatElement;
  const initialRepeats = props.initialRepeats? props.initialRepeats : 3;

  // const [repeats, setRepeats] = useState(initialRepeats);

  let classProps = ['repeater__wrap'];
  if (props.disabled) {
    classProps.push('repeater__wrap--disabled');
    props.repeatProps.disabled = true;
  }
  if (props.required) {
    classProps.push('repeater__wrap--required');
    props.repeatProps.required = true;
  }
  if (props.error) {
    classProps.push('repeater__wrap--error');
    props.repeatProps.error = true;
    props.repeatProps.hideError = true;
  }

  if (props.className) {classProps.push(props.className)}
  if (props.noLabel) {classProps.push('repeater__wrap--no-label')}
  if (props.noMargin) {classProps.push('repeater__wrap--no-margin')}

  let noTitle = props.noTitle ? true : false;
  if (props.noLabel) {noTitle = true}

  let content = [];
  if(props.blockedLines){
    if(props.dataToRepeat){
      content = props.dataToRepeat.map((data, i) => {return <RepeatElement repeatData={data} setData={props.setData} data={props.data} canRemoveRow={props.dataToRepeat.length > 1} methods={props.methods} name={`${props.name}.${i}`} key={i} {...props.repeatProps} hideUnitsForRepeatedElements={true} i={i} index={props.index}/>})
    }
  }
  else {
    let repeatNumber = props.repeats || initialRepeats || props.initialRepeats 
    for (let i = 0; i < repeatNumber; i++) {
      props.repeatProps.id = id+i;
      content.push(<RepeatElement key={i} {...props.repeatProps} hideUnitsForRepeatedElements={true} i={i} index={props.index}/>);
    }
  }

  
  

  function addRow(e){
    e.preventDefault();
    if(props.methods){
      let dataClone = global.structuredClone(props.methods.getValues());
      let value = getPropertyByPath(dataClone, props.name);
      let objToClone = value.value
    if(props.structureToRepeat){
      objToClone.push(objToClone[props.structureToRepeat]);
    }else {
    // const firstLevelKeys = Object.keys(objToClone[objToClone.length-1]);
    // const clonedObject = firstLevelKeys.reduce((obj, key) => {
    //   obj[key] = objToClone[key];
    //   return obj;
    // }, {});
    // objToClone.push(objToClone[objToClone.length-1]);
      objToClone.push(objToClone[objToClone.length-1]);
    }
    props.setData(dataClone)
  }
  }
  let repeatNumber = 1
  if(props.methods){
    let values =props.methods.getValues()
    let val = getPropertyByPath(values, props.name);
    if(val){
      repeatNumber= val.value.length
    }
    
  }
  return (
    <div ref={ref} className={classProps.join(' ')}>
      {noTitle ? "" : 
        <>
          <label className="repeater__label" htmlFor={props.id ? props.id : props.name}>
            {props.label ? props.label : props.name}: {props.required ? <span className="small">[Required]</span> : ""}
          </label>
          {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : "" }
        </>
      }
      <div className="repeater__content">
        {content}
      </div>
      <div className="repeater__footer">
        <div className="repeater__messages">
          {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
              <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
            </p> : "" }
          {/* {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : "" } */}
        </div>
        <div className="repeater__controls">
          {/* <Button action="secondary" onClick={(e) => props.removeRepeat ? props.removeRepeat(e) : setRepeats(repeats-1)} disabled={props.disabled} className={props.error? "button--warning" : ""}><FontAwesomeIcon icon={faMinus} /> Remove Row</Button> */}
          <Button action="secondary" onClick={addRow} disabled={repeatNumber >= props.maxRepeats} className={props.error? "button--warning" : ""}><FontAwesomeIcon icon={faPlus} /> Add ELR</Button>
        </div>
      </div>
      {props.children}
    </div>
  )
}