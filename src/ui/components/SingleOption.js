import React, { useState } from "react";
import _uniqueId from "lodash/uniqueId";
import Select from "../base/Select";
import Radio from "../base/Radio";
import RadioGroup from "../base/RadioGroup";

export default function SingleOption({ register, methods, ...props }) {
  const [thisId] = useState(_uniqueId());
  const id = props.id ? props.id : thisId;

  let classProps = ["single-option__wrap"];
  if (props.disabled) {
    classProps.push("single-option__wrap--disabled");
  }
  if (props.className) {
    if (typeof props.className === "object") {
      classProps.push(props.className.join(" "));
    } else {
      classProps.push(props.className);
    }
  }

  if (props.error) {
    classProps.push("single-option__wrap--error");
  }
  if (props.noLabel) {
    classProps.push("single-option__wrap--no-label");
  }
  if (props.noMargin) {
    classProps.push("single-option__wrap--no-margin");
  }

  let value = null;
  if(methods){
    value=methods.getValues(props.name) || props.defaultValue;
  }

  let selectProps = {
    className: classProps,
    noLabel: props.noLabel ? props.noLabel : false,
    noMargin: props.noMargin ? props.noMargin : false,
    hideError: props.hidError ? props.hideError : false,
    required: props.required ? props.required : false,
    disabled: props.disabled ? props.disabled : false,
    readonly: props.readonly ? props.readonly : false,
    fullWidth: props.fullWidth ? props.fullWidth : false,
    id: id,
    value: props.value ? props.value : undefined,
    inputValue: props.inputValue ? props.inputValue : undefined,
    name: props.name ? props.name : "",
    label: props.label ? props.label : null,
    helpText: props.helpText ? props.helpText : null,
    children: props.children ? props.children : null,
    defaultValue: props.defaultValue ? props.defaultValue : undefined,
    defaultInputValue: props.defaulttInputValue
      ? props.defaulttInputValue
      : undefined,
    filterOption: props.filterOption
      ? props.filterOption
      : props.defaultValue
      ? false
      : undefined,
    isLoading: props.isLoading || undefined,
    placeholder: props.placeholder || undefined,
    isMulti: props.isMulti || undefined,
    error: ((!value || value.length ===0) && props.required) ? {type: "required"} : props.error,
  };
  if(selectProps.error){
    classProps.push("single-option__wrap--error");
  }
  if (props.error) {
    selectProps.error = props.error;
  }
  if (props.onChange) {
    selectProps.onChange = props.onChange;
  }
  if (props.onInputChange) {
    selectProps.onInputChange = props.onInputChange;
  }
  if (props.onBlur) {
    selectProps.onBlur = props.onBlur;
  }
  if (props.isSearchable) {
    selectProps.isSearchable = props.isSearchable;
  }
  if (props.onInputChange) {
    selectProps.onInputChange = props.onInputChange;
  }
  if (props.inputValue) {
    selectProps.inputValue = props.inputValue;
  }
  if (props.controlShouldRenderValue) {
    selectProps.controlShouldRenderValue = props.controlShouldRenderValue;
  }

  const options = props.options ? props.options : [];
  let useOptions = [];
  if (Array.isArray(options)) {
    options.map((opt) => {
      if (typeof opt === "string") {
        useOptions.push({ value: opt, label: opt });
      } else if (typeof opt === "object") {
        useOptions.push(opt);
      } else {
      }
      return null;
    });
  } else {
    Object.entries(options).map((optval) => {
      useOptions.push({ value: optval[0], label: optval[1] });
      return null;
    });
  }

  
  let content = [];
  let errors= []
  switch (props.displayType) {
    case "toggle":
      let toggles = [];
      useOptions.map((option, i) => {
        toggles.push(
          <Radio
            key={i}
            val={props.value}
            value={option.value}
            label={option.label}
            toggle={true}
            name={props.name}
            disabled={props.disabled}
            error={props.error}
            onChange={props.onChange}
            setData={props.setData}
          />
        );
        return null;
      });
      content.push(
        <RadioGroup
          key={"radio-toggles-" + id}
          register={register ? register : null}
          methods={methods ? methods : null}
          errors={errors ? errors : null}
          {...selectProps}
          radioType="toggle"
        >
          {toggles}
        </RadioGroup>
      );
      break;
    case "radio":
      let radios = [];
      useOptions.map((option, i) => {
        radios.push(
          <Radio
            key={i}
            value={option.value}
            label={option.label}
            toggle={false}
            name={props.name}
            disabled={props.disabled}
            error={props.error}
          />
        );
        return null;
      });
      content.push(
        <RadioGroup
          key={"radio-buttons-" + id}
          register={register}
          methods={methods}
          errors={errors}
          {...selectProps}
          radioType="default"
        >
          {radios}
        </RadioGroup>
      );
      break;
    case "dropdown":
      content.push(
        <Select
          key={"select-" + id}
          name={props.name}
          register={register}
          methods={methods}
          errors={errors}
          options={options}
          rhf={props.rhf}
          {...selectProps}
          setData={props.setData}
        />
      );
      break;
    default:
      content.push(
        <Select
          key={"select-" + id}
          register={register}
          methods={methods}
          errors={errors}
          options={options}
          rhf={props.rhf}
          displayType={props.displayType}
          loadOptions={props.loadOptions}
          {...selectProps}
          setData={props.setData}
        />
      );
  }

  return <>{content}</>;
}
