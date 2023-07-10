import React, { useState, useEffect, useRef } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick';

import InputLoading from './InputLoading';
import Repeater from './Repeater';
import LocationUnitsToggle from './LocationUnitsToggle';
import DataTable from './DataTable';
import EngineeringLocation from './EngineeringLocation';

export default function EngineeringLocationMulti(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [elrs, setElrs] = useState([]);

  const [thisId] = useState(_uniqueId())
  const id = props.id ? props.id : thisId;

  const elrId = "elr-"+id;
  const trackId = 'track-'+id;
  const milesId = "miles-"+id;
  const yardsId = "yards-"+id;
  const units = "units-"+id;

  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);

  const initialVals = {
    [elrId] : "",
    [trackId]: "",
    [milesId] : "0",
    [yardsId] : "0",
    [units] : "milesYards",
  };
  const [vals, setVals] = useState(initialVals)
  const [values, setValues] = props.values? [props.values, props.setValues] : [vals, setVals];

  OutsideClick(ref, () => setShowHelp(false));

  useEffect(() => {
    if(props.elrs) {
      setIsLoaded(true);
      setElrs(props.elrs);
    } else {
      fetch("./assets/json/elrs.json")
        .then((res) => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setElrs(result);
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    }
  }, []);

  let classProps = ['engineering-location-multi__wrap'];
  if (props.disabled) {classProps.push('engineering-location-multi__wrap--disabled')}
  if (props.className) {classProps.push(props.className)}
  if (props.error) {classProps.push('engineering-location-multi__wrap--error')}
  if (props.noLabel) {classProps.push('engineering-location-multi__wrap--no-label')}
  if (props.noMargin) {classProps.push('engineering-location-multi__wrap--no-margin')}

  const unitTitles = {
    milesYards: {
      majorUnit: "Miles",
      minorUnit: "Yards"
    },
    milesChains: {
      majorUnit: "Miles",
      minorUnit: "Chains"
    },
    km: {
      majorUnit: "KM",
      minorUnit: "Metres"
    }
  };

  let milesLabel = values[units] ? unitTitles[values[units]].majorUnit : "Miles";
  let yardsLabel = values[units] ? unitTitles[values[units]].minorUnit : "Yards";

  const onChangeValues = (e) => {
    //console.log("you changed "+e.target.name);
    setValues(values => ({ ...values, [e.target.name]: e.target.value }));
    console.log(values);
  }

  const onElrSelected = (item) => {
    //console.log("you selected "+item.name+" at the Engineering Location Multi component level");
    const activeELR = document.activeElement;
    let thisId = activeELR.id;
    let id = thisId.substring(3);
    let thisElr = "elr-"+id;
    //console.log(id);
    setValues(values => ({ ...values, [thisElr]: item.name }));
    console.log(values);
  }
  
  const onElrCleared = () => {
    console.log("you cleared the input at the Engineering Location Multi component level");
  }

  const locationUnitsToggleProps = {
    id: id,
    className: "engineering-location-multi__units",
    disabled: props.disabled? true : false,
    error: props.error? props.error : false,
    values: values,
    onChange: onChangeValues
  };

  const EngineeringLocationStructure = {
    headers : [
      { Header: 'ELR', accessor: 'elr', type: 'input' },
      { Header: milesLabel, accessor: 'miles', type: 'input' },
      { Header: yardsLabel, accessor: 'yards', type: 'input' },
    ],
    rows : [
      { accessor: 'elr', component: 'Elr', name : 'elr', value: '', onChange: onElrSelected, onClear: onElrCleared, elrs: elrs },
      { accessor: 'miles', component: 'Input', name : 'miles', type : "number", value: '', onChange: onChangeValues },
      { accessor: 'yards', component: 'Input', name : 'yards', type : "number", value: '', onChange: onChangeValues },
    ]
  };

  const tableProps = {
    id: id,
    className: "engineering-location-multi__table",
    label: props.label? props.label : 'Engineering Location Table',
    disabled: props.disabled? true : false,
    required: props.required? true : false,
    helpText: "",
    error: props.error? props.error : false,
    noLabel: props.noLabel? true : false,
    structure: EngineeringLocationStructure,
    noLabel: true,
    hideError: true,
    noMargin: true,
  };

  const repeaterProps = {
    label: props.label? props.label : 'Repeater with Engineering Location',
    disabled: props.disabled? true : false,
    required: props.required? true : false,
    helpText: props.helpText? props.helpText : "",
    error: props.error? props.error : false,

    repeatElement: EngineeringLocation,
    repeatProps: {
      label: props.label? props.label : 'Engineering Location',
      disabled: props.disabled? true : false,
      required: props.required? true : false,
      helpText: "",
      error: props.error? props.error : false,
      singleField: false,
      inlineUnits: false,
      noTitle: true,
      hideError: true,
    },
    initialRepeats: 1,
  }

  let content = "";
  if (error) {
    content = <div className="error">Error: {error.message}</div>;
  } else if (!isLoaded) {
    content = <InputLoading {...tableProps} />;
  } else {
    content = <>
    {props.table? 
      <div ref={ref} className={classProps.join(' ')}>
        {props.noLabel? "" : 
          <label className="engineering-location-multi__label">
            {props.label ? props.label : props.name}: {props.required ? <span className="small">[Required]</span> : ""}
          </label>
        }
        {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : "" }

            <LocationUnitsToggle {...locationUnitsToggleProps} />
            <DataTable {...tableProps} /> 
        {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
            <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
          </p> : "" }
        {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : "" }
        {props.children}
      </div>
    : 
      <Repeater {...repeaterProps} />
    }
  </>
  }

  return (
    <>
      {content}
    </>
  )
}