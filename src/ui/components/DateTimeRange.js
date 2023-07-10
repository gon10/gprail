import React, { useState, useRef} from 'react';
import _uniqueId from 'lodash/uniqueId';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick';
import Input from '../base/InputRhf';

export function DateTimeRangeWrap({ control, register, methods, errors, ...props }) {
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));

  const [thisId] = useState(_uniqueId())
  const id = props.id ? props.id : thisId;

  let classProps = ['date-time-range__wrap'];
  if (props.disabled) { classProps.push('date-time-range__wrap--disabled') }
  if (props.className) { classProps.push(props.className) }
  if (props.error) { classProps.push('date-time-range__wrap--error') }
  if (props.noLabel) { classProps.push('date-time-range__wrap--no-label') }
  if (props.noMargin) { classProps.push('date-time-range__wrap--no-margin') }

  let containerProps = {
    id: id,
    name: props.name ? props.name : "multiple-options-" + id,
    className: classProps,
    required: props.required ? props.required : false,
    disabled: props.disabled ? props.disabled : false,
    readOnly: props.readOnly ? props.readOnly : false,
    noLabel: props.noLabel ? props.noLabel : false,
    noMargin: props.noMargin ? props.noMargin : false,
    hideError: props.hidError ? props.hideError : false,
    fullWidth: props.fullWidth ? props.fullWidth : false,
    label: props.label ? props.label : null,
    helpText: props.helpText ? props.helpText : null,
    children: props.children ? props.children : null,
    error: props.error ? props.error : null,
    onChange: props.onchange ? props.onchange : null,
    onBlur: props.onBlur ? props.onBlur : null,
    control: control,
    register: register,
    methods: methods,
    errors: errors,
  };

  return (
    <div ref={ref} className={containerProps.className.join(' ')}>
      {containerProps.noLabel ? null :
        <label className="date-time-range__label" htmlFor={containerProps.name}>
          {containerProps.label ? containerProps.label : containerProps.name}: {containerProps.required ? <span className="small">[Required]</span> : ""}
        </label>
      }
      {containerProps.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : ""}

      {React.Children.map(props.children, child => {
        //console.log(child.props.type);
        return child.props.name
          ? React.createElement(child.type, {
            ...{
              ...child.props,
              register: register,
              key: child.props.name,
              error: errors,
            }
          })
          : child;
      })}

      {containerProps.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
        <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {containerProps.helpText}
      </p> : null}
      {(containerProps.error && !containerProps.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {containerProps.error.message}</p> : ""}
    </div>
  )
}

export default function DateTimeRange({ control, register, methods, errors, ...props }) {
  const [thisId] = useState(_uniqueId())
  const id = props.id ? props.id : thisId;

  let classProps = ['date-time-range__wrap'];
  if (props.disabled) { classProps.push('date-time-range__wrap--disabled') }
  if (props.className) { classProps.push(props.className) }
  if (props.error) { classProps.push('date-time-range__wrap--error') }
  if (props.noLabel) { classProps.push('date-time-range__wrap--no-label') }
  if (props.noMargin) { classProps.push('date-time-range__wrap--no-margin') }

  let containerProps = {
    id: id,
    name: props.name ? props.name : "multiple-options-" + id,
    className: classProps,
    required: props.required ? props.required : false,
    disabled: props.disabled ? props.disabled : false,
    readOnly: props.readOnly ? props.readOnly : false,
    noLabel: props.noLabel ? props.noLabel : false,
    noMargin: props.noMargin ? props.noMargin : false,
    hideError: props.hidError ? props.hideError : false,
    fullWidth: props.fullWidth ? props.fullWidth : false,
    label: props.label ? props.label : null,
    helpText: props.helpText ? props.helpText : null,
    children: props.children ? props.children : null,
    error: props.error ? props.error : null,
    onChange: props.onchange ? props.onchange : null,
    onBlur: props.onBlur ? props.onBlur : null,
    control: control,
    register: register,
    methods: methods,
    errors: errors,
  };

  let type = "datetime-local";
  if (props.timeOnly || props.type === "time") { type = "time" }
  if (props.dateOnly || props.type === "date") { type = "date" }

  let inputPropsFrom = {
    className: "date-time-range-from",
    type: type,
    noLabel: true,
    noMargin: true,
    hideError: true,
    id: id + "-from",
    name: props.name + ".from",
    min: props.min ? props.min : undefined,
    max: methods.getValues(props.name + ".until"),
    step: props.step ? props.step : undefined,
    disabled: props.disabled ? props.disabled : undefined,
    readonly: props.readonly ? props.readonly : undefined,
    error: props.error ? props.error : undefined,
    errors: errors ? errors : undefined,
    required: props.required ? props.required : false,
    placeholder: props.placeholder ? props.placeholder : undefined,
  };

  let inputPropsTo = {
    className: "date-time-range-to",
    type: type,
    noLabel: true,
    noMargin: true,
    hideError: true,
    id: id + "-until",
    name: props.name + ".until",
    min: methods.getValues(props.name + ".from"),
    max: props.max ? props.max : undefined,
    step: props.step ? props.step : undefined,
    disabled: props.disabled ? props.disabled : undefined,
    readonly: props.readonly ? props.readonly : undefined,
    error: props.error ? props.error : undefined,
    errors: errors ? errors : undefined,
    required: props.required ? props.required : false,
    placeholder: props.placeholder ? props.placeholder : undefined,
  };

  return (
    <DateTimeRangeWrap {...containerProps}>
      <Input
        {...inputPropsFrom}
        allValues={props.allValues}
        // {...register(props.name + ".from", {
        //   required: props.required,
        //   minLength: { value: props.minLength, message: "Please enter more characters" },
        //   maxLength: { value: props.maxLength, message: "Please enter less characters" },
          
        //   //valueAsDate: true,
        // }
        // )}
      />
      <Input
        {...inputPropsTo}
        allValues={props.allValues}
        // {...register(props.name + ".until", {
        //   required: props.required,
        //   minLength: { value: props.minLength, message: "Please enter more characters" },
        //   maxLength: { value: props.maxLength, message: "Please enter less characters" },

        //   //valueAsDate: true,
        // }
        // )}
      />
    </DateTimeRangeWrap>
  )
}