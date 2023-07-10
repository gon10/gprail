import React, { useState, useContext } from 'react';
import _uniqueId from 'lodash/uniqueId';
import DocumentLinkage from './DocumentLinkage';

export default function Elr({register, methods, errors, ...props}) {
  const [thisId] = useState(_uniqueId());
  const id = props.id ? props.id : thisId;

  const { /*elr,*/ setElr } = props.ElrContext? useContext(props.ElrContext) : [null, null];
  //console.log(elr)
  
  const elrProps = {
    className: props.className ? "elr__search-autocomplete " + props.className : "elr__search-autocomplete",
    id: id,
    name: props.name ? `${props.name}` : "elr",
    label: props.label ? props.label : "ELR",
    helpText: props.helpText,
    required: props.required,
    disabled: props.disabled,
    noLabel: props.noLabel,
    noMargin: props.noMargin,
    autoCompleteLimit: 6,
    fetchFields: ["inINM","inNESA","elrCode","mileageFrom","mileageTo","trackIds","nesaDiagrams"],
    isMulti: false,
    queryFields: ["elrCode"],
    refDocCollection: "network-gbr-ELRs",
    initialValues: props.initialValues,
    fieldsToShow: ["elrCode"],
    register: register,
    methods: methods,
    errors: errors,
    unregister: methods.unregister,
    onChange: setElr,
    rhf: props.rhf
  };

  return <DocumentLinkage {...elrProps} 
  setData={props.setData} additionalNameToChange={props.additionalNameToChange} unsetOnChange={props.unsetOnChange}
  />
}