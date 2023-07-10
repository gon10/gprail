import React, { useState } from "react";
import _uniqueId from "lodash/uniqueId";
import { changeValueByPath } from "../../Helpers/utils";

export default function Radio({ register, ...props }) {
  const [thisId] = useState(_uniqueId());
  const id = props.id ? props.id : thisId;

  let classProps = ["radio__wrap"];
  if (props.disabled) {
    classProps.push("radio__wrap--disabled");
  }
  if (props.className) {
    classProps.push(props.className);
  }
  if (props.error) {
    classProps.push("radio__wrap--error");
  }
  if (props.toggle) {
    classProps.push("radio__wrap--toggle");
  }

  let inputProps = {
    className: "radio",
    type: "radio",
    name: props.name,
    value: props.value,
    label: props.label,
    id: id,
    checked: props.value === props.val
  };

  if (props.checked) {
    inputProps.checked = "checked";
  }
  if (props.selected) {
    inputProps.checked = "checked";
  }
  if( props.methods){
    inputProps.checked = props.methods.getValues(props.name) === props.label || props.methods.getValues(props.name) === props.value;
  }
  
  if (props.disabled) {
    inputProps.disabled = props.disabled;
  }
  if (props.readonly) {
    inputProps.readonly = props.readonly;
  }
  inputProps.required = props.required ? props.required : false;
  if (props.onChange) {
    inputProps.onChange = props.onChange;
  }
  if (props.onBlur) {
    inputProps.onBlur = props.onBlur;
  }

  function onChange(e) {
    let value = e.target.value
    if(props.methods && props.setData){
      let copy = global.structuredClone(props.methods.getValues());
      changeValueByPath(copy, props.name, value);
      props.setData(copy);
    }
  }

  let content;
  if (register) {
    content = (
      <input
        // {...register(props.name, {
        //   required: inputProps.required,
        //   type: "radio",
        //   valueAsNumber: props.type === "number" ? true : false,
        //   onChange: (e) => {
        //     console.log("radio onchange")
        //     if(props.onChange){
        //       console.log("radio props.onchange")
        //       props.onChange(e)
        //     }else{
        //       onChange(e)
        //     }
        //     },
        // })}
        onChange={onChange}
        {...inputProps}
      />
    );
  } else {
    content = <input {...inputProps} 
    onChange= {(e) => {
      props.onChange(e)}
    }/>;
  }

  return (
    <div className={classProps.join(" ")}>
      {content}
      <label className="radio__label" htmlFor={inputProps.id}>
        <span className="radio__label__text">
          {props.label ? props.label : props.value}
        </span>
      </label>
    </div>
  );
}
