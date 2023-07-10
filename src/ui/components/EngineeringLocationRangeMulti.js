import React from 'react';
import Repeater from './Repeater';
import EngineeringLocationRange from './EngineeringLocationRange';
import ELRStructure from'../../Structures/ELRStructure.json';

export default function EngineeringLocationRangeMulti({ register, methods, errors, ...props }) {
  let classProps = ['elr-range-multi__wrap'];
  if (props.disabled) {classProps.push('elr-range-multi__wrap--disabled')}
  if (props.className) {classProps.push(props.className)}
  if (props.error) {classProps.push('elr-range-multi__wrap--error')}
  if (props.noLabel) {classProps.push('elr-range-multi__wrap--no-label')}
  if (props.noMargin) {classProps.push('elr-range-multi__wrap--no-margin')}

  let repeats = 1
  let data = null
  if(methods){
    if(methods.getValues(props.name))
    {
      data=methods.getValues(props.name)
      repeats = methods.getValues(props.name).length;}
  }
  
  const repeaterProps = {
    label: props.label? props.label : 'Repeater with Engineering Location Range',
    disabled: props.disabled? true : false,
    required: props.required? true : false,
    helpText: props.helpText? props.helpText : "",
    error: props.error? props.error : false,
    register: register,
    methods: methods,
    errors: errors,

    repeatElement: EngineeringLocationRange,
    repeatProps: {
      label: props.label? props.label : 'Engineering Location Range',
      disabled: props.disabled? true : false,
      required: props.required? true : false,
      helpText: "",
      error: props.error? props.error : false,
      singleField: false,
      inlineUnits: false,
      noTitle: true,
      hideError: true,
      register: register,
      methods: methods,
      errors: errors,
    },
    initialRepeats: 1,
    repeats: repeats,
    maxRepeats: props.maxRepeats
  }

  return <Repeater {...repeaterProps} name={props.name} structureToRepeat={ELRStructure} blockedLines={true} dataToRepeat={data} setData={props.setData} data={props.data} index={props.index}/>
}