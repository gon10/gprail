import React, { useState, useRef } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick';
import Elr from './Elr/';
import TrackId from './TrackId'
import Mileage from './Mileage';
import Radio from '../base/Radio';
import RadioGroup from '../base/RadioGroup';

export default function EngineeringLocation(props) {
  const [thisId] = useState(_uniqueId())
  const id = props.id ? props.id : thisId;
  const [thisFromId] = useState(_uniqueId())
  const fromId = props.fromId ? props.fromId : thisFromId;
  const [thisToId] = useState(_uniqueId())
  const toId = props.toId ? props.toId : thisToId;

  const elrId = "elr-"+id;
  const trackId = 'track-'+id;

  const milesFromId = "miles-"+fromId;
  const yardsFromId = "yards-"+fromId;
  const milesYardsFromId = "milesYards-"+fromId;
  const unitsFromId = "units-"+fromId;

  const milesToId = "miles-"+toId;
  const yardsToId = "yards-"+toId;
  const milesYardsToId = "milesYards-"+toId;
  const unitsToId = "units-"+toId;

  const units = "units-"+id;

  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);

  const initialVals = {
    [elrId] : "",
    [trackId]: "",
    [milesFromId] : "0",
    [yardsFromId] : "0",
    [milesYardsFromId] : "0.0000",
    [unitsFromId] : "milesYards",
    [milesToId] : "0",
    [yardsToId] : "0",
    [milesYardsToId] : "0.0000",
    [unitsToId] : "milesYards",
    [units] : "milesYards",
  };
  const [vals, setVals] = useState(initialVals)
  const [values, setValues] = props.values? [props.values, props.setValues] : [vals, setVals];

  OutsideClick(ref, () => setShowHelp(false));

  let classProps = ['elr-segment__wrap'];
  if (props.disabled) {classProps.push('elr-segment__wrap--disabled')}
  if (props.className) {classProps.push(props.className)}
  if (props.error) {classProps.push('elr-segment__wrap--error')}
  if (props.noLabel) {classProps.push('elr-segment__wrap--no-label')}
  if (props.noMargin) {classProps.push('elr-segment__wrap--no-margin')}
  if (!props.inlineUnits) {classProps.push('elr-segment__wrap--no-units')}
  if (props.singleField) {classProps.push('elr-segment__wrap--single-mileage')}
  if (props.trackId) {classProps.push('elr-segment__wrap--track-id')}

  let fromProps = {
    className: props.className? "elr-segment__mileage "+props.className : "elr-segment__mileage",
    label: "From",
    noLabel: props.noLabel? true: false,
    noMargin: true,
    noTitle: true,
    id: fromId,
    hideError: true,
  };

  let toProps = {
    className: props.className? "elr-segment__mileage "+props.className : "elr-segment__mileage",
    label: "To",
    noLabel: props.noLabel? true: false,
    noMargin: true,
    noTitle: true,
    id: toId,
    hideError: true,
  };

  if (props.disabled) {
    fromProps.disabled = props.disabled;
    toProps.disabled = props.disabled;
  }
  if (props.readonly) {
    fromProps.readonly = props.readonly;
    toProps.readonly = props.readonly;
  }
  if (props.error) {
    fromProps.error = props.error;
    toProps.error = props.error;
  }

  fromProps.required = props.required ? props.required : false;
  toProps.required = props.required ? props.required : false;

  if (props.placeholder) {
    fromProps.placeholder = props.placeholder;
    toProps.placeholder = props.placeholder; 
  }
  if (props.onChange) {
    fromProps.onChange = props.onChange;
    toProps.onChange = props.onChange; 
  }
  if (props.onBlur) {
    fromProps.onBlur = props.onBlur;
    toProps.onBlur = props.onBlur;
  }
  if (props.singleField) {
    fromProps.singleField = props.singleField;
    toProps.singleField = props.singleField;
  }
  if (!props.inlineUnits) {
    fromProps.noUnits = true;
    toProps.noUnits = true;
  }

  let ElrProps = {
    className: "elr-segment__elr",
    label: props.elrLabel? props.elrLabel : "ELR",
    noLabel: props.noLabel,
    noMargin: true,
    id: id,
  };

  let TrackIdProps = {
    className: "elr-segment__track-id",
    label: props.trackIdLabel? props.trackIdLabel : "Track ID",
    noLabel: props.noLabel,
    noMargin: true,
    id: id,
  };

  if (props.disabled) {ElrProps.disabled = props.disabled}
  if (props.readonly) {ElrProps.readonly = props.readonly}
  if (props.error) {ElrProps.error = props.error}
  ElrProps.hideError = true;
  ElrProps.required = props.required ? props.required : false;
  if (props.onChange) {ElrProps.onChange = props.onChange}
  if (props.onBlur) {ElrProps.onBlur = props.onBlur}

  let noTitle = props.noTitle ? true : false;
  if (props.noLabel) {noTitle = true}

  const elrs = [
    { id: 0, name: 'ECM1', mileageFrom: "1", mileageTo: "100" },
    { id: 1, name: 'ECM2', mileageFrom: "101", mileageTo: "150" },
    { id: 2, name: 'ECM3', mileageFrom: "251", mileageTo: "220" },
    { id: 3, name: 'ARG', mileageFrom: "1", mileageTo: "38" },
    { id: 4, name: 'WSP', mileageFrom: "56", mileageTo: "112" },
    { id: 5, name: 'BEC', mileageFrom: "10", mileageTo: "45" },
    { id: 6, name: 'HSL', mileageFrom: "7", mileageTo: "9" },
    { id: 7, name: 'PEC', mileageFrom: "5", mileageTo: "99" }
  ];

  const onElrSelected = (item) => {
    console.log("you selected "+item.name);
    setValues(values => ({ ...values, [elrId]: item.name }));
    console.log(values);
  }

  const onElrCleared = () => {
    console.log("you cleared the input");
    setValues(initialVals);
  }

  const onChangeValues = (e) => {
    if (e.target.name === units) {
      setValues(values => ({ ...values, 
        [units]: e.target.value,
        [unitsFromId]: e.target.value,
        [unitsToId]: e.target.value,
       }));
       console.log("units selected");
    } else {
      console.log("you changed "+e.target.name);
      setValues(values => ({ ...values, [e.target.name]: e.target.value }));
    }
    console.log(values);
  }

  const onChange = props.onChange? props.onChange : onElrSelected;
  const onClear = props.onClear? props.onClear : onElrCleared;

  return (
    <div ref={ref} className={classProps.join(' ')}>
      {noTitle ? "" : 
        <label className="elr-segment__label" htmlFor={props.id ? props.id : props.name}>
          {props.label ? props.label : props.name}: {props.required ? <span className="small">[Required]</span> : ""}
        </label>
      }
      {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : "" }
      
      {props.inlineUnits? null :
      <RadioGroup className="elr-range__units" disabled={props.disabled} error={props.error} radioType="toggle" noMargin fullWidth hideError >
        <Radio 
          name={units} value="milesYards" label="Miles/Yards"
          checked={values[units] === "milesYards"} disabled={props.disabled} toggle={true} onChange={(e) => onChangeValues(e)}
        />
        <Radio 
          name={units} value="milesChains" label="Miles/Chains"
          checked={values[units] === "milesChains"} disabled={props.disabled} toggle={true} onChange={(e) => onChangeValues(e)}
        />
        <Radio 
          name={units} value="km" label="KM/Metres"
          checked={values[units] === "km"} disabled={props.disabled} toggle={true} onChange={(e) => onChangeValues(e)}
        />
      </RadioGroup>}

      <Elr items={elrs} {...ElrProps} onElrSelected={(e) => onChange(e)} onElrCleared={() => onClear()} />

      {props.trackId ? <TrackId {...TrackIdProps} disabled={values[elrId]? false : true} onChange={(e) => onChangeValues(e)} /> : null }

      <Mileage
        {...fromProps}
        disabled={values[elrId] ? false : true} 
        values={values} setValues={setValues} 
        onChange={(e) => onChangeValues(e)} 
        initialValues={initialVals} />

      <Mileage
        {...toProps}
        disabled={values[elrId] ? false : true} 
        values={values} setValues={setValues} 
        onChange={(e) => onChangeValues(e)} 
        initialValues={initialVals} />

      {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
          <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
        </p> : "" }
      {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : "" }
      {props.children}
    </div>
  )
}