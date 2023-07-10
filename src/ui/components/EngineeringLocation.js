import React, { useState, useRef, createContext } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick';
import Elr from './Elr';
import TrackId from './TrackId'
import Mileage from './Mileage';

export const ElrContext = createContext({
  elr: [],
  setElr: () => { }
})

export default function EngineeringLocation({ register, methods, errors, ...props }) {
  const [thisId] = useState(_uniqueId())
  const id = props.id ? props.id : thisId;
  //const elrId = "elr-" + id;
  //const trackId = 'track-' + id;
  //const mileageId = "mileage-"+id;
  //const startMilesId = "startMiles-"+id;
  //const endMilesId = "endMiles-"+id;
  //const milesId = "miles-" + id;
  //const yardsId = "yards-" + id;
  //const milesYardsId = "milesYards-" + id;
  //const unitsId = "units-" + id;

  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  //const [mileageFrom, setMileageFrom] = useState();
  //const [mileageTo, setMileageTo] = useState();

  /*const initialVals = {
    [elrId]: "",
    //[mileageId]: "",
    [trackId]: "",
    //[startMilesId] : "",
    //[endMilesId] : "",
    [milesId]: "0",
    [yardsId]: "0",
    [unitsId]: "milesYards",
    [milesYardsId]: "0.0000"
  };*/
  //const [vals, setVals] = useState(initialVals)
  //const [values, setValues] = props.values ? [props.values, props.setValues] : [vals, setVals];

  OutsideClick(ref, () => setShowHelp(false));

  const [elr, setElr] = useState([])
  const elrValue = { elr, setElr };
  
  let classProps = ['engineering-location__wrap'];
  if (props.disabled) { classProps.push('engineering-location__wrap--disabled') }
  if (props.className) { classProps.push(props.className) }
  if (props.error) { classProps.push('engineering-location__wrap--error') }
  if (props.noLabel) { classProps.push('engineering-location__wrap--no-label') }
  if (props.noMargin) { classProps.push('engineering-location__wrap--no-margin') }
  if (props.noUnits) { classProps.push('engineering-location__wrap--no-units') }
  if (props.singleField) { classProps.push('engineering-location__wrap--single-mileage') }
  if (props.trackId) { classProps.push('engineering-location__wrap--track-id') }

  const elrProps = {
    className: "engineering-location__elr",
    label: props.elrLabel ? props.elrLabel : "ELR",
    id: id,
    name: "elr",
    //helpText: "Search an ELR",
    required: props.required,
    disabled: props.disabled,
    error: props.error,
    initialValues: props.initialValues,
    noLabel: props.noLabel,
    noMargin: true,
    hideError: true,
    register: register,
    methods: methods,
    errors: errors,
    ElrContext: ElrContext
  };

  const trackIdProps = {
    className: "engineering-location__track-id",
    label: props.trackIdLabel ? props.trackIdLabel : "Track ID",
    noLabel: props.noLabel,
    noMargin: true,
    id: id,
    methods: methods,
  };

  const mileageProps = {
    className: "engineering-location__mileage",
    name: "mileage",
    label: "Miles",
    //helpText: "Enter a mileage for this ELR",
    required: true,
    disabled: props.disabled,
    noUnits: props.noUnits,
  }

  let noTitle = props.noTitle;
  if (props.noLabel) { noTitle = true }




  return (
    <div ref={ref} className={classProps.join(' ')}>
      <ElrContext.Provider value={elrValue}>
        {noTitle ? "" :
          <label className="engineering-location__label" htmlFor={props.id ? props.id : props.name}>
            {props.label ? props.label : props.name}: {props.required ? <span className="small">[Required]</span> : ""}
          </label>
        }
        {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : ""}

        <Elr {...elrProps} required name={`${props.name}.elr`} unsetOnChange={[`${props.name}.trackId`,`${props.additionalNameToChange}.trackId`]} additionalNameToChange={props.additionalNameToChange ? `${props.additionalNameToChange}.elr`: undefined} 
        rhf setData={props.setData} disabled={props.elrDisabled} />

        {props.trackId ? <TrackId {...trackIdProps} options={`${props.name}.elr`} name={`${props.name}.trackId`} required
        // additionalNameToChange={props.additionalNameToChange ? `${props.additionalNameToChange}.trackId`: undefined} 
        rhf setData={props.setData}/> : null}

        <Mileage  {...mileageProps} name={`${props.name}.mileage`} elr={`${props.name}.elr`} singleField
        register={register} methods={methods} setData={props.setData}/>

        {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
          <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
        </p> : ""}
        {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : ""}
        {props.children}
      </ElrContext.Provider>
    </div>
  )
}