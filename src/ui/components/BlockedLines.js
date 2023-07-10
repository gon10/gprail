import React, { useState, useRef, useEffect } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { faInfoCircle, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick';
import DocumentLinkage from './DocumentLinkage';
import Input from '../base/InputRhf';
import SingleOption from './SingleOption'
import EngineeringLocationRangeMulti from './EngineeringLocationRangeMulti';
import { Button } from '../base';
import getPropertyByPath from '../../Helpers/utils';
import ProtectionSystem from './ProtectionSystem';
import lineAtSiteStructure from'../../Structures/lineAtSiteStructure.json';
import lineStructure from'../../Structures/lineStructure.json';
import { UnitsContext } from '../../App';
import { useContext } from 'react';

export default function BlockedLines({ register, methods, errors, ...props }) {
  const {setUnits } = useContext(UnitsContext)
  useEffect(() => {
    if(methods){
      let values = methods.getValues(props.name)
      if(!values){
        let blockedLine = lineAtSiteStructure
        props.setData(curr => ({...curr, [props.name]:blockedLine}))
      }
    }
    setUnits("milesYards")
  }, [])
  
  const [id] = useState(_uniqueId());
  const lineName = "lineName-"+id;
  const lineStatus = "lineStatus-"+id;
  const lineSpeed = "lineSpeed-"+id;
  const lineDirection = "lineDirection-"+id;
  const lineElectrification = "lineElectrification-"+id;

  const typeFrom = "typeFrom-"+id;
  const nameFrom = "nameFrom-"+id;
  const typeTo = "typeTo-"+id;
  const nameTo = "nameTo-"+id;

  const protectingSignals = "protectingSignals-"+id;
  const disconnectionPoints = "disconnectionPoints-"+id;
  const additionalSignals = "additionalSignals-"+id;

  const elr = "elr-"+id;
  const mileage = "mileage-"+id;
  const startMiles = "startMiles-"+id;
  const endMiles = "endMiles-"+id;
  const miles = "miles-"+id;
  const yards = "yards-"+id;
  const units = "units-"+id;
  const milesYards = "milesYards-"+id;

  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));

  const initialVals = {
    [lineName]: "",
    [lineStatus]: "open",
    [lineSpeed]: "",
    [lineDirection]: "bi-directional",
    [lineElectrification]: "none",

    [typeFrom]: "signal",
    [nameFrom]: "",
    [typeTo]: "signal",
    [nameTo]: "",

    [protectingSignals]: "",
    [disconnectionPoints]: "",
    [additionalSignals]: "",

    [elr]: "",
    [mileage]: "",
    [startMiles]: "",
    [endMiles]: "",
    [miles]: "0",
    [yards]: "0",
    [units]: "milesYards",
    [milesYards]: "0.0000"
  };
  const [vals, setVals] = useState(initialVals)
  const [values, setValues] = props.values? [props.values, props.setValues] : [vals, setVals];

  let lineSpeedOptions = {};
  let speedUnits = "mph";
  let speedIncrement = 5;
  let speedMax = 125;
  for (let i = 5; i <= speedMax; i = i + speedIncrement) {
    lineSpeedOptions[i] = i + " "+speedUnits;
  }

  let classProps = ['blocked-lines__wrap'];
  if (props.disabled) {classProps.push('blocked-lines__wrap--disabled')}
  if (props.className) {classProps.push(props.className)}
  if (props.error) {classProps.push('blocked-lines__wrap--error')}
  if (props.noLabel) {classProps.push('blocked-lines__wrap--no-label')}
  if (props.noMargin) {classProps.push('blocked-lines__wrap--no-margin')}

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

  const showOpenLines = props.showOpenLines ? true : false;
  const showSpeed = props.showSpeed ? true : false;
  const showDirection = props.showDirection ? true : false;
  const showElectrification = props.showElectrification ? true : false;
  const showProtectionLimits = props.showProtectionLimits ? true : false;
  const showDisconnectionPoints = props.showDisconnectionPoints ? true : false;
  const showAdditionalSignals = props.showAdditionalSignals ? true : false;
  const showELRInfo = props.showELRInfo ? true : false;

  const signalPanelProps = {
    className: "blocked-lines__input blocked-lines__signal-panel-from",
    id: id,
    label: "Signal Panel",
    helpText: "Search for a signal panel",
    required: props.required,
    disabled: props.disabled,
    noLabel: props.noLabel,
    noMargin: props.noMargin,
    autoCompleteLimit: 6,
    fetchFields: ["name"],
    isMulti: false,
    queryFields: ["name"],
    refDocCollection: "network-gbr-signalPanel",
    fieldsToShow: ["name"],
    register: register,
    methods: methods,
    errors: errors,
    unregister: methods.unregister,
  };

  const onChangeValues = (e, ...rest) => {
    setValues(values => ({ ...values, [e.target.name]: e.target.value }));
  }

  function addRow(e){
    e.preventDefault();
    if(methods){
      let dataClone = global.structuredClone(methods.getValues());
      let value = getPropertyByPath(dataClone, props.name);
      let objToClone = value.value.lines
      objToClone.push(lineStructure);
      props.setData(dataClone)
    }
  }

  function copyRow(e, index){
    e.preventDefault();
    if(methods){
      let dataClone = global.structuredClone(methods.getValues());
      let value = getPropertyByPath(dataClone, props.name);
      let objToClone = value.value.lines
      objToClone.push(objToClone[index]);
      props.setData(dataClone)
    }
  }

  function removeRow(e, index){
    e.preventDefault();
    if(methods){
      let dataClone = global.structuredClone(methods.getValues());
      let value = getPropertyByPath(dataClone, props.name);
      let objToClone = value.value.lines
      objToClone.splice(index, 1)
      props.setData(dataClone)
    }
  }

  let value = props.initialValues
  let linesNumber = 1
  let maxLines = props.maxLines || 6
  let maxELrs = props.maxELrs || 6
  if(methods){
    value =  methods.getValues();
    let val = getPropertyByPath(value, props.name);
    if(val && val.value && val.value.lines){
      linesNumber= val.value.lines.length
    }
  }

  function checkLineNameUniqueness(lineName, index) {
     let lineFound = value[props.name].lines.find((line, i) =>  line.lineName === lineName && index !== i);
      if(lineFound){
        return false
      }else
     return true;
  }

  return (
    <div ref={ref} className={classProps.join(' ')} >
      {props.noLabel? "" : <>
        <label className="blocked-lines__label" htmlFor={props.id ? props.id : props.name}>
          {props.label ? props.label : props.name}: {props.required ? <span className="small">[Required]</span> : ""}
        </label>
        </>
      }
      {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : "" }
      {value[props.name] && value[props.name].lines && value[props.name].lines.map((line, index) => <React.Fragment key={index}>
        

      <div className="blocked-lines__section blocked-lines__line-info">
        <h5 className="blocked-lines__section__header">Line Information</h5>
        
          <Input name={`${props.name}.lines.${index}.lineName`} index={index} checkLineNameUniqueness={checkLineNameUniqueness} className="blocked-lines__input blocked-lines__track-id" label="Line Name" {...inputProps} hideError={false} required
          />
        {showOpenLines? <SingleOption 
          name={`${props.name}.lines.${index}.protectionStatus`}
          displayType="toggle"
          className="blocked-lines__input" 
          label="Status" 
          fullWidth 
          hideErrors 
          {...inputProps}
          options={[
            {label: "Open", value: "Open"},
            {label: "Blocked", value: "Blocked"},
          ]}
          disabled={inputProps.disabled}
          setData={props.setData}
          required
          // onChange={(e) => onChangeValues(e)}
        /> : null}
        {showSpeed? <SingleOption 
          name={`${props.name}.lines.${index}.speed.value`} 
          displayType="dropdown"
          className="blocked-lines__input blocked-lines__line-speed" 
          label="Speed" 
          {...inputProps} 
          options={lineSpeedOptions}
          rhf={true}
          setData={props.setData}
          required 

        /> : null}
        {showDirection? <SingleOption
          
          name={`${props.name}.lines.${index}.direction`}
          displayType="toggle" 
          className="blocked-lines__input" 
          label="Direction" 
          fullWidth 
          {...inputProps}
          options={[
            {label: "Up", value: "Up"},
            {label: "Down", value: "Down"},
            {label: "Bi", value: "Bidirectional"},
            {label: "Uni", value: "Unidirectional"}
          ]}
          disabled={inputProps.disabled}
          setData={props.setData}
          required 
          // onChange={(e) => onChangeValues(e)}
        /> : null}
        {showElectrification? <SingleOption
          displayType="toggle" 
          className="blocked-lines__input" 
          label="Electrification" 
          fullWidth 
          {...inputProps}
          name={`${props.name}.lines.${index}.electrification`}
          disabled={inputProps.disabled} 
          // onChange={(e) => onChangeValues(e)} 
          options={[
            {label: "None", value: "None"},
            {label: "AC", value: "AC"},
            {label: "DC", value: "DC"},
            {label: "Both", value: "Both"}
          ]}
          setData={props.setData}
          required 
          /> : null}
        
        
      </div>


      {!showELRInfo && <div className="blocked-lines__section blocked-lines__blockage-info">
        <h5 className="blocked-lines__section__header">Blockage Information</h5>
        <DocumentLinkage {...signalPanelProps} name={`${props.name}.lines.${index}.signalPanel`} setData={props.setData} data={props.data} rhf/>
        <div className="blocked-lines__limit">
          <SingleOption 
            name={`${props.name}.lines.${index}.protectionLimits.from.limitType`} 
            displayType="toggle"
            className="blocked-lines__input blocked-lines__type-from"
            label="From" 
            fullWidth 
            disabled={inputProps.disabled} 
            {...inputProps} 
            options={[
              { label: "Signal", value: "Signal" },
              { label: "Point", value: "Point" },
              { label: "Buffer", value: "Buffer Stop" }
            ]}
            required
            setData={props.setData}  
            // onChange={(e) => onChangeValues(e)} 
          />
          <Input name={`${props.name}.lines.${index}.protectionLimits.from.limitValue`} className="blocked-lines__input blocked-lines__name-from" noLabel 
            {...inputProps} onChange={(e) => onChangeValues(e)} required/>
        </div>
        <div className="blocked-lines__limit">
          <SingleOption 
            name={`${props.name}.lines.${index}.protectionLimits.to.limitType`} 
            displayType="toggle"
            className="blocked-lines__input blocked-lines__type-from"
            label="to" 
            fullWidth 
            disabled={inputProps.disabled} 
            {...inputProps} 
            options={[
              { label: "Signal", value: "Signal" },
              { label: "Point", value: "Point" },
              { label: "Buffer", value: "Buffer Stop" }
            ]}
            required 
            setData={props.setData} 
            // onChange={(e) => onChangeValues(e)} 
          />
          <Input name={`${props.name}.lines.${index}.protectionLimits.to.limitValue`} className="blocked-lines__input blocked-lines__name-to" noLabel 
            {...inputProps} onChange={(e) => onChangeValues(e)} required/>

          {showProtectionLimits? <Input name={`${props.name}.lines.${index}.protectionLimits.protectingSignals`}  className="blocked-lines__input blocked-lines__protecting-signals" 
            label="Protecting Signals" {...inputProps} 
          /> : null}
        </div>
      </div>}


      { (showProtectionLimits || showDisconnectionPoints)?
      <div className="blocked-lines__section blocked-lines__additional-info">
        <h5 className="blocked-lines__section__header">Additional Information</h5>
        {/* {showProtectionLimits? <Input name={`${props.name}.lines.${index}.protectionLimits.protectingSignals`}  className="blocked-lines__input blocked-lines__protecting-signals" 
          label="Protecting Signals" {...inputProps} 
          /> : null} */}
        {showDisconnectionPoints? <Input values={values}   name={disconnectionPoints} className="blocked-lines__input blocked-lines__disconnection-points" 
          label="Disconnection Points" {...inputProps} onChange={(e) => onChangeValues(e)} /> : null} 
      </div> : null}

      { showELRInfo? 
        <EngineeringLocationRangeMulti name={`${props.name}.lines.${index}.lineElrInfo`} id={id} className="blocked-lines__section blocked-lines__elr-info" singleField={false} trackId={true} table={false}
          label="ELR Information" methods={methods} setData={props.setData} data={props.data} 
          {...inputProps} maxRepeats={maxELrs} noTitle index={index}/>
       : null}
        { showELRInfo&& <div className="form__footer form__footer--no-border" style={{justifyContent: "end", padding: "0"}}>
          <Button action="tertiary" onClick={(e) => removeRow(e, index)} disabled={linesNumber <=1} className={props.error? "button--warning" : ""}><FontAwesomeIcon icon={faTrash} /> Remove Line</Button>
          <Button action="secondary" onClick={(e) => copyRow(e, index)} disabled={linesNumber >= maxLines} className={props.error? "button--warning" : ""}><FontAwesomeIcon icon={faPlus} /> Clone Line</Button>
          <Button action="primary" onClick={(e) => addRow(e)} disabled={linesNumber >= maxLines} className={`${props.error? "button--warning" : ""}`}><FontAwesomeIcon icon={faPlus} /> Add new line</Button>
        
        </div>}
        
      {showProtectionLimits ? <ProtectionSystem {...props} {...inputProps} index={index} />: null}
       </React.Fragment>)}

       { (showProtectionLimits || showDisconnectionPoints)?
      <div className="blocked-lines__section blocked-lines__additional-info">
        {/* <h5 className="blocked-lines__section__header">Additional Information</h5> */}
        
      {showAdditionalSignals? <Input name={`${props.name}.additionalSignals`} className="blocked-lines__input blocked-lines__additional-signals" 
          label="Additional Signals held at Danger" {...inputProps} onChange={(e) => onChangeValues(e)} /> : null} 
      </div> : null}
       

      {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
          <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
        </p> : "" }
      {/* {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : "" } */}
      {props.children}
    </div>
  )
}