import React, { useEffect, useRef, useState } from "react";
import { changeValueByPath } from "../../Helpers/utils";
import OutsideClick from "../../Helpers/OutsideClick";
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
const mileageServiceAPI = `${process.env.REACT_APP_BASE_URL}/api/railhub/secured/fields/mileage`
export default function MileageSingleField({register,...props}) {
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));
  const [value, setValue] = useState();
  let error = {invalid: false, message: ""}
  let minMiles, maxMiles,minYards,maxYards =undefined
  let miles,
    yards = 0;
  if (props.methods) {
    miles = props.methods.getValues(props.miles);
    yards = props.methods.getValues(props.yards);
    minMiles=props.methods.getValues(`${props.elr}[0].mileageFrom.${props.units}.${props.milesId}`);
    maxMiles=props.methods.getValues(`${props.elr}[0].mileageTo.${props.units}.${props.milesId}`);
    minYards=props.methods.getValues(`${props.elr}[0].mileageFrom.${props.units}.${props.yardsId}`);
    maxYards=props.methods.getValues(`${props.elr}[0].mileageTo.${props.units}.${props.yardsId}`);

    props.methods.register(props.miles, 
      { 
        value: miles, 
        max: maxMiles, min: minMiles,
        required: props.required
      })
    props.methods.register(props.yards, 
      { 
        value: yards, 
        max: miles ===maxMiles? maxYards: undefined, 
        min: miles ===minMiles? minYards: undefined,
        required: props.required
      })

      if(props.methods.getFieldState(props.miles).invalid || props.methods.getFieldState(props.yards).invalid){
        error.invalid=true;
        error.message = `Please enter a location between ${minMiles} ${props.milesId} ${minYards} ${props.yardsId} and ${maxMiles} ${props.milesId} ${maxYards} ${props.yardsId}`
      }
  }
  let classProps = ['input__wrap'];

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

  const milesId = unitTitles[props.units].majorUnit;
  const yardsId = unitTitles[props.units].minorUnit;
  const unitsId = "units"
  

  function handleOnChange(event) {
    const inputValue = event.target.value;

    let sanitizedValue = inputValue.replace(/[^0-9.]/g, ""); // Remove any characters that are not numbers or dots

    // Check if the dot is the first character
    if (sanitizedValue.indexOf(".") === 0) {
      sanitizedValue = sanitizedValue.slice(1); // Remove the dot
    }

    // Check if there is more than one dot in the string
    const dotCount = sanitizedValue.split(".").length - 1;
    if (dotCount > 1) {
      sanitizedValue = sanitizedValue.replace(/\.+$/g, ""); // Remove any additional dots
    }

    setValue(sanitizedValue);

    // Check if there is more than one dot in the string
    const dotIndex = sanitizedValue.indexOf(".");

    let leftValue, rightValue;

    if (dotCount > 1) {
      // Remove any extra dots
      const dotParts = sanitizedValue.split(".");
      leftValue = Number(dotParts[0]);
      rightValue = Number(dotParts.slice(1).join(""));
    } else if (
      dotCount === 1 &&
      dotIndex !== 0 &&
      dotIndex !== sanitizedValue.length - 1
    ) {
      // Extract values on the left and right of the dot
      leftValue = Number(sanitizedValue.substring(0, dotIndex));
      rightValue = Number(sanitizedValue.substring(dotIndex + 1));
    } else {
      // No dot or invalid dot position
      leftValue = Number(sanitizedValue.replace(".", ""));
      rightValue = 0;
    }

    const initialVals = {
      [milesId] : leftValue,
      [yardsId] : rightValue,
      // [milesYardsId]: 0.0000,
      [unitsId] : props.units,
    }
  
    let valuesToSend = {
      "mileage": {
        [props.units]: initialVals
      }
    }

    axios.post(mileageServiceAPI, valuesToSend)
      .then(
        (result) => {
          if (result.data.success) {

            if (props.methods && props.setData) {
              let copy = global.structuredClone(props.methods.getValues());
              changeValueByPath(copy, props.name, result.data.data);
              props.setData(copy);
            }
          } else {

          }
        },
        (error) => {

        }
      )

    // if (props.methods && props.setData) {
    //   let copy = global.structuredClone(props.methods.getValues());
    //   changeValueByPath(copy, props.miles, leftValue);
    //   changeValueByPath(copy, props.yards, rightValue);
    //   props.setData(copy);
    // }
  }
  let val = 0;
  if (value || value === "" || value === 0) {
  // if(value && value.endsWith(".")){
    val = value;
  } else {
    if(miles || miles === 0){
      val = `${miles}${yards ? `.${yards}`: ""}`;
    }else{
      val = 0
    }
  }

  useEffect(() => {
   setValue()
  }, [props.units])
  

  return (
    <div ref={ref} className={classProps.join(" ")}>
      {props.noLabel ? (
        ""
      ) : (
        <label
          className="input__label"
          htmlFor={props.id ? props.id : props.name}
        >
          {props.label ? props.label : props.name}:{" "}
          {props.required ? <span className="small">[Required]</span> : ""}
        </label>
      )}
      {props.helpText ? (
        <FontAwesomeIcon
          icon={faInfoCircle}
          className={
            showHelp ? "input__help input__help--active" : "input__help"
          }
          onClick={() => setShowHelp(true)}
        />
      ) : (
        ""
      )}
      <input className="input" type="string" value={val}  onChange={handleOnChange}></input>

      {props.helpText ? (
        <p
          className={
            showHelp
              ? "input__help-text input__help-text--show"
              : "input__help-text"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} className="input__icon" />{" "}
          {props.helpText}
        </p>
      ) : (
        ""
      )}
      {error.invalid ? (
        <p className="input__error">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="input__icon"
          />{" "}
          {error.message}
        </p>
      ) : (
        ""
      )}
      {props.children}
    </div>
  );
}
