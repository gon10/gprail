import React, { useState, useRef, useEffect } from 'react';
import { Controller } from "react-hook-form";
import _uniqueId from 'lodash/uniqueId';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick';
import Checkbox from './Checkbox';
import Radio from './Radio';
import RadioGroup from './RadioGroup';

export default function Boolean({ control, register, methods, errors, ...props }) {
  const ref = useRef();
  const [thisId] = useState(_uniqueId())
  const id = props.id ? props.id : thisId;
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));

  const [checked] = useState(props.defaultChecked);

  let options;
  if (props.trueValueText && props.falseValueText) {
    options = {
      "true": props.trueValueText,
      "false": props.falseValueText
    }
  }

  let classProps = ["boolean__wrap"];
  if (props.disabled) { classProps.push("boolean__wrap--disabled") };
  if (props.error) { classProps.push("boolean__wrap--error") };
  if (props.noLabel) { classProps.push('boolean__wrap--no-label') }
  if (props.noMargin) { classProps.push('boolean__wrap--no-margin') }
  if (props.inline) { classProps.push('boolean__wrap--inline') }
  if (props.className) { classProps.push(props.className) }

  let inputProps = {
    className: "boolean",
    type: "checkbox",
    name: props.name ? props.name : "nameRequired",
    id: "bool" + id,
    checked: props.checked ? "checked" : undefined,
    disabled: props.disabled ? props.disabled : undefined,
    readOnly: props.readOnly ? props.readOnly : undefined,
    // required: props.required ? props.required : undefined,
    //onChange: props.onChange? props.onChange : undefined,
    //onClick: () => setChecked(!checked),
    onBlur: props.onBlur ? props.onBlur : undefined,
    error: errors ? errors : undefined,
    //onChange: e => setChecked(e.target.checked),
  };
  if (props.selected) { inputProps.checked = "checked" }

  useEffect(() => {
    if (props.onChange) {
      props.onChange(checked);
    }
  }, [checked]);

  const booleanLabel = props.label ?
    <label className={props.inline ? props.right ? "boolean__wrap__inline-label--right" : "boolean__wrap__inline-label" : "boolean__wrap__label"}>
      <label>{props.label}</label> {props.required ? <span className="small">[Required]</span> : ""}
      {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : ""}
    </label> : "";

  const booleanToggle = <div key={"boolean-" + id} ref={ref} className={classProps.join(' ')} >
    <Controller
      control={control}
      name={props.name}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <>
          {(props.right || !props.inline) ? booleanLabel : ""}
          <input
            {...register(props.name, {
              required: inputProps.required,
            }
            )}
            onChange={() => onChange(!value)}
            {...inputProps}
            checked={value === undefined ? props.defaultValue === true: value === true}
          />
          <label className="boolean__label" htmlFor={inputProps.id}></label>
          {(props.right || !props.inline) ? "" : booleanLabel}
          {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
            <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
          </p> : ""}
          {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : ""}
        </>
      )}
    />
  </div>

  let content = [];
  switch (props.displayType) {
    case "toggle":
      if (options) {
        let toggles = [];
        Object.entries(options).map((optval, k) => {
          toggles.push(<Radio key={k}
            value={optval[0]}
            label={optval[1]}
            toggle={true}
            name={props.name}
            disabled={props.disabled}
            error={props.error}
          />)
          return null;
        })
        content.push(<RadioGroup key={"radio-toggles-" + id} register={register} methods={methods} errors={errors} {...inputProps} className="" radioType="toggle">{toggles}</RadioGroup>);
      } else {
        content.push(booleanToggle);
      }
      break
    case "radio":
      let radios = [];
      Object.entries(options).map((optval, k) => {
        radios.push(<Radio key={k}
          value={optval[0]}
          label={optval[1]}
          toggle={false}
          name={props.name}
          disabled={props.disabled}
          error={props.error}
        />)
        return null;
      })
      content.push(<RadioGroup key={"radio-buttons" + id} register={register} methods={methods} errors={errors} {...inputProps} className="" radioType="default">{radios}</RadioGroup>);
      break
    case "checkbox":
      content.push(<Checkbox key={"checkbox" + id}
        register={register}
        methods={methods}
        errors={errors}
        {...inputProps}
        className=""
        label={props.label} />);
      break
    default:
      content.push(booleanToggle);
  }

  return (
    <>
      {content}
    </>
  )
};