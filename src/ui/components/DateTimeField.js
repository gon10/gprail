import React from 'react'
import { useState } from 'react';
import _uniqueId from 'lodash/uniqueId';
import Input from '../base/InputRhf';

export default function DateTimeField({ control, register, methods, errors, ...props }) {
    const [thisId] = useState(_uniqueId())
    const id = props.id ? props.id : thisId;

    let classProps = ['date-time-range__wrap'];
    if (props.disabled) { classProps.push('date-time-range__wrap--disabled') }
    if (props.className) { classProps.push(props.className) }
    if (props.error) { classProps.push('date-time-range__wrap--error') }
    if (props.noLabel) { classProps.push('date-time-range__wrap--no-label') }
    if (props.noMargin) { classProps.push('date-time-range__wrap--no-margin') }

    let startDateTimeInputProps = {
        name: props.name,
        label: props.label ? props.label : null,
        id: id+"start",
        type: "datetime-local",
        className: classProps,
        required: props.required ? props.required : false,
        disabled: props.disabled ? props.disabled : false,
        readOnly: props.readOnly ? props.readOnly : false,
        noLabel: props.noLabel ? props.noLabel : false,
        noMargin: props.noMargin ? props.noMargin : false,
        hideError: props.hidError ? props.hideError : false,
        helpText: props.helpText ? props.helpText : null,
        children: props.children ? props.children : null,
        error: props.error ? props.error : null,
        onChange: props.onchange ? props.onchange : null,
        onBlur: props.onBlur ? props.onBlur : null,
        control: control,
        register: register,
        methods: methods,
        errors: errors,
        // fullWidth: true
    };
  return (
    <Input
          {...startDateTimeInputProps}
      />
  )
}
