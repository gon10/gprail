import React, { useState, useEffect, useRef, useContext } from 'react';
import { UnitsContext} from '../../App'
import { ElrContext} from './EngineeringLocation'
import axios from 'axios'
import _uniqueId from 'lodash/uniqueId';
import { faInfoCircle, faExclamationTriangle, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick';
// import Input from '../base/Input';
import Select from '../base/Select';
import { InputRhf } from '../base';
import MileageSingleField from './MileageSingleField';

export default function Mileage({register, methods, errors, ...props}) {
  const [thisId] = useState(_uniqueId())
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(true)

  const { units, setUnits } = useContext(UnitsContext)
  const [localUnits, setLocalUnits] = useState(units)

  const defaultBoundaries = {
    milesYards: {
      minUnit: "",
      maxUnit: "",
      minMajorUnit: "",
      minMinorUnit: "0",
      maxMajorUnit: "",
      maxMinorUnit: "1759"
    },
    milesChains: {
      minUnit: "",
      maxUnit: "",
      minMajorUnit: "",
      minMinorUnit: "0",
      maxMajorUnit: "",
      maxMinorUnit: "79"
    },
    km: {
      minUnit: "",
      maxUnit: "",
      minMajorUnit: "",
      minMinorUnit: "0",
      maxMajorUnit: "",
      maxMinorUnit: "999"
    }
  }

  const { elr } = ElrContext? useContext(ElrContext) : null;
  const [boundaries, setBoundaries] = useState(defaultBoundaries)
  const [helpText, setHelpText] = useState(props.helpText);

  useEffect(() => {
    if(elr.length > 0) {
      if (elr[0].mileageFrom && elr[0].mileageTo ) {
        const from = elr[0].mileageFrom
        const to = elr[0].mileageTo
        const elrBoundaries = {
          milesYards: {
            minUnit: `${from.milesYards.miles}.${from.milesYards.yards}`,
            maxUnit: `${to.milesYards.miles}.${to.milesYards.yards}`,
            minMajorUnit: from.milesYards.miles,
            minMinorUnit: "0",
            maxMajorUnit: to.milesYards.miles,
            maxMinorUnit: "1759"
          },
          milesChains: {
            minUnit: `${from.milesChains.miles}.${from.milesChains.chains}`,
            maxUnit: `${to.milesChains.miles}.${to.milesChains.chains}`,
            minMajorUnit: from.milesChains.miles,
            minMinorUnit: "0",
            maxMajorUnit: to.milesChains.miles,
            maxMinorUnit: "79"
          },
          km: {
            minUnit: `${from.km.kilometres}.${from.km.metres}`,
            maxUnit: `${to.km.kilometres}.${to.km.metres}`,
            minMajorUnit: from.km.kilometres,
            minMinorUnit: "0",
            maxMajorUnit: to.km.kilometres,
            maxMinorUnit: "999"
          }
        }
        setBoundaries(elrBoundaries)

        const elrBoundaryHelpText = `Please enter a location between ${from[units].displayValue} and ${to[units].displayValue}`
        setHelpText(elrBoundaryHelpText)
        /* 
        ToDo: We will need to add logic so that when the max miles is reached we restrict max yards to the elrBoundary
        similarly if min miles is entered we restrict yards to the boundary of the elr. Same for km and milesChains 
        Not essential for release 1 though so leave for future development when there is capacity. ~DR
        */ 
      }
    } 
  }, [elr, units])

  const unitTitles = {
    milesYards: {
      majorUnit: "miles",
      minorUnit: "yards"
    },
    milesChains: {
      majorUnit: "miles",
      minorUnit: "chains"
    },
    km: {
      majorUnit: "kilometres",
      minorUnit: "metres"
    }
  };

  

  const milesId = unitTitles[units].majorUnit;
  const yardsId = unitTitles[units].minorUnit;
  const milesYardsId = units;
  const unitsId = "units"
  
  const initialVals = props.val ? {
    [milesId] : props.val[units][milesId],
    [yardsId] : props.val[units][yardsId],
    [milesYardsId]: 0.0000,
    [unitsId] : units,
  } :  {
    [milesId] :  0,
    [yardsId] : 0,
    [milesYardsId]: 0.0000,
    [unitsId] : units,
  }

  const [values, setValues] = props.values? props.values : useState(initialVals)

  
  useEffect(() => {
    if(props.val){
      handleChange(units, {
        "mileage": {
          [units]: {
            
            [milesId] : props.val[units][milesId],
            [yardsId] : props.val[units][yardsId],
            [milesYardsId]: 0.0000,
            [unitsId] : units,
          }
        }
      })
    }
  }, [props.val])
  const [returnedValues, setReturnedValues] = useState()

  const mileageServiceAPI = `${process.env.REACT_APP_BASE_URL}/api/railhub/secured/fields/mileage`

  // --------------------------
  // mileageService expects an object like 
  /*let exampleMileage = {
    "mileage": {
      "km": {
        "kilometres": 0,
        "metres": 649       
      }
    }
  }*/
  let valuesToSend = {
    "mileage": {
      [localUnits]: values
    }
  }
  // ---------------------------
  // and returns like this 
  /*let exampleReturned = {
    "totalYards": 709,
    "milesYards": {
        "miles": 0,
        "yards": 709,
        "displayValue": "0m 709yds"
    },
    "milesChains": {
        "miles": 0,
        "chains": 32,
        "displayValue": "0m 32ch"
    },
    "km": {
        "kilometres": 0,
        "metres": 649,
        "displayValue": "0.649 km"
    }
  }*/
  // ---------------------------

  const handleChange = (val, valToSend) => {
    setIsLoaded(false)
    setError(null)
    axios.post(mileageServiceAPI, valToSend ? valToSend :valuesToSend)
      .then(
        (result) => {
          if (result.data.success) {
            setIsLoaded(true)
            setLocalUnits(val)
            setUnits(curr => val)
            setReturnedValues(result.data.data)
          } else {
            setError({message: "Failed to get mileage. Please try again."})
            setIsLoaded(true)
          }
        },
        (error) => {
          setError(error)
          setIsLoaded(true)
        }
      )
  }

  // useEffect(() => {
  //   handleChange(units)
  // },[units])

  useEffect(() => {
    if(returnedValues) {
      let newVals =  { 
        [milesId] : returnedValues[units][milesId],
        [yardsId] : returnedValues[units][yardsId],
      };
      setValues(newVals)
    }
  },[returnedValues])

  OutsideClick(ref, () => setShowHelp(false));

  let classProps = ['mileage__wrap'];
  if (props.disabled) {classProps.push('mileage__wrap--disabled')}
  if (props.className) {classProps.push(props.className)}
  if (props.error) {classProps.push('mileage__wrap--error')}
  if (props.noLabel) {classProps.push('mileage__wrap--no-label')}
  if (props.noMargin) {classProps.push('mileage__wrap--no-margin')}
  if (props.noUnits) {classProps.push('mileage__wrap--no-units')}
  if (props.singleField) {classProps.push('mileage__wrap--single-field')}

  let inputProps = {
    type: "number",
    noLabel: props.noLabel,
    noMargin: true,
    hideError: true,
  };

  if (props.disabled) {inputProps.disabled = props.disabled}
  if (props.readonly) {inputProps.readonly = props.readonly}
  if (props.error) {inputProps.error = props.error}
  inputProps.required = props.required ? props.required : false;
  if (props.placeholder) {inputProps.placeholder = props.placeholder}
  if (props.onBlur) {inputProps.onBlur = props.onBlur}

  // const onChangeValues = (e) => {
  //   setValues(values => ({ ...values, [e.target.name]: e.target.value }));
  // }

  // const onChange = props.onChange ? props.onChange : onChangeValues;

  // let milesYardsLabel = props.label ? props.label + " " : ""; 
  // milesYardsLabel += values[unitsId] ? unitTitles[values[unitsId]].majorUnit+"."+unitTitles[values[unitsId]].minorUnit : props.name +": ";

  let milesLabel = [props.label ? props.label + " " : ""];
  milesLabel.push(values[unitsId] ? unitTitles[values[unitsId]].majorUnit : props.name +": ");

  return (
    <div ref={ref} className={classProps.join(' ')}>
      {helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : "" }
      {props.singleField ?
        // <Input name={milesYardsId} className="mileage__miles-yards" id={`mileage__miles-yards-${thisId}`}
        //   label={milesYardsLabel} 
        //   register={register? register : null} 
        //   methods={methods? methods : null} 
        //   errors={errors? errors : null} 
        //   {...inputProps} min={boundaries[units].minUnit} max={boundaries[units].maxUnit} 
        //   value={values[milesYardsId]} onChange={(e) => onChange(e)} />
        <MileageSingleField
          name={props.name} 
          label={units}
          miles={`${props.name}.${units}.${milesId}`} 
          yards={`${props.name}.${units}.${yardsId}`}
          units={units}
          milesId={milesId}
          yardsId={yardsId}
          elr={props.elr}
          register={register? register : null} 
          methods={methods? methods : null} 
          errors={errors? errors : null} 
          setData={props.setData}
          required
        /> 
        : 
        <>
        <InputRhf name={`${props.name}.${units}.${milesId}`} className="mileage__miles" id={`mileage__miles-${thisId}`}
          label={milesId}
          type={"number"} 
          register={register? register : null} 
          methods={methods? methods : null} 
          errors={errors? errors : null} 
          {...inputProps} min={boundaries[units].minMajorUnit} max={boundaries[units].maxMajorUnit} step={1}
          />
          <InputRhf name={`${props.name}.${units}.${yardsId}`} className="mileage__miles" id={`mileage__miles-${thisId}`}
          label={yardsId}
          type={"number"} 
          register={register? register : null} 
          methods={methods? methods : null} 
          errors={errors? errors : null} 
          {...inputProps} min={boundaries[units].minMajorUnit} max={boundaries[units].maxMajorUnit} step={1}
          />
          </>
          }

      {props.noUnits? null : 
      <Select name={unitsId} className="mileage__units" label="Units" id={`mileage__units-${thisId}`}
        {...inputProps} 
        options={
          [
            {value: "milesYards", label: "miles/yards"},
            {value: "milesChains", label: "miles/chains"},
            {value: "km", label: "kilometres/metres"},
          ]
        }
        defaultValue={{value: units, label: `${milesId}/${yardsId}`}} 
        value={units}
        onChange={(e) => handleChange(e.value)} />}

      {helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
          <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {helpText}
        </p> : "" }
      {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : "" }
      {error? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {error.message}</p> : "" }
      {!isLoaded? <p className="input__loading"><FontAwesomeIcon icon={faClock} className="input__icon" /> Loading...</p> : "" }
      {props.children}
    </div>
  )
}