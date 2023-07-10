import React from 'react';

import { InputRhf } from '../base'
import DocumentLinkage from './DocumentLinkage'
import FieldArray from './FieldArray'
import ElrSegmentReadOnly from './ElrSegmentReadOnly'
import getPropertyByPath from '../../Helpers/utils';


export default function EditableDocumentLinkage({ control, register, methods, errors, ...props }) { 

  let classProps = ["editable-document-linkage"];
  if(props.condensed) {classProps.push("editable-document-linkage--condensed")}
  
  let inputs = [];
  if(props.defaultVals && props.defaultVals["documents"] &&  props.defaultVals["documents"].length > 0) {
    props.defaultVals["documents"].map( (item, i) => {
      inputs.push([])
      props.fields.map((field, key) => {
          const component = field.uiComponentName;
          const fieldName = component === "locationNesaGallery" ? `engineeringLocations` : `documents[${i}].${field.boundFieldName}`;
          const label = field.prompt ? field.prompt : "Missing Label";
          const helpText = field.helpText;
          const value = component === "locationNesaGallery" ? item["engineeringLocations"] :  item[field.boundFieldName];
          //console.log(field.boundFieldName)
          //console.log(value)
          const required = field.isRequired;
          const disabled = field.disabled;
          const minLength = field.minLength;
          const maxLength = field.maxLength;
          const isUnique = field.isUnique;
          const isUniqueOnTable = field.isUniqueOnTable;
          const min = field.min;
          const numRows = field.numRows;
          const noLabel = field.noLabel;
          const readonly = field.readonly;
          
          if (component) {
            switch (component) {
              case "h2":
                inputs[i].push(<h2 key={'edl'+i+key}>{value}</h2>)
                break
              case "textField":
                inputs[i].push(<InputRhf
                  key={'edl'+i+key}
                  type="text"
                  name={fieldName}
                  label={label}
                  helpText={helpText}
                  required={required}
                  disabled={disabled}
                  minLength={minLength}
                  maxLength={maxLength}
                  isUnique={isUnique}
                  isUniqueOnTable={isUniqueOnTable}
                  numRows={numRows}
                  readonly={readonly}
                  //recordsForField={recordsForField}
                  register={register}
                  methods={methods}
                  errors={errors}
                  value={value}
                />)
                break
              case "integerField":
                inputs[i].push(<InputRhf
                  key={'edl'+i+key}
                  type="number"
                  name={fieldName}
                  label={label}
                  helpText={helpText}
                  required={required}
                  disabled={disabled}
                  minLength={minLength}
                  maxLength={maxLength}
                  isUnique={isUnique}
                  isUniqueOnTable={isUniqueOnTable}
                  readonly={readonly}
                  //recordsForField={recordsForField}
                  min={min}
                  register={register}
                  methods={methods}
                  errors={errors}
                />)
                break
              case "fieldArray":
                inputs[i].push(<FieldArray
                  key={'edl'+i+key}
                  name={fieldName}
                  field={field}
                  index={i}
                  label={label}
                  helpText={helpText}
                  required={required}
                  disabled={disabled}
                  noLabel={noLabel}
                  fullWidth={true}
                  condensed={props.condensed}
                  repeatElement={InputRhf}
                  repeatProps={ {
                    type: "text",
                    name: fieldName,
                    //label: label,
                    helpText: helpText,
                    required: required,
                    disabled: disabled,
                    minLength: minLength,
                    maxLengt: maxLength,
                    isUnique: isUnique,
                    isUniqueOnTable:{isUniqueOnTable},
                    numRows: numRows,
                    noLabel: true,
                  } }
                  initialRepeats={value ? value.length: 0}
                  value={value}
                  register={register}
                  methods={methods}
                  errors={errors}
                />)
                break
              case "documentLinkageField":
                inputs[i].push(<DocumentLinkage
                  key={'edl'+i+key}
                  name={fieldName}
                  label={label}
                  helpText={helpText}
                  required={required}
                  disabled={disabled}
                  readonly={readonly}
                  autoCompleteLimit={field.autoCompleteLimit}
                  fetchFields={field.fetchFields}
                  isMulti={field.isMultiSelect}
                  queryFields={field.queryFields}
                  queryFilter={field.queryFilter}
                  refDocCollection={field.refDocCollection}
                  //initialValues={initialValues}
                  fieldsToShow={field.fieldsToShow}
                  val={value}
                  register={register}
                  unregister={methods.unregister}
                  methods={methods}
                  errors={errors}
                />)
                break
              case "elrSegmentReadOnly":
                inputs[i].push(<ElrSegmentReadOnly
                  key={'edl'+i+key}
                  name={fieldName}
                  value={getPropertyByPath(item, field.boundFieldName).value}
                />)
                break

                // case "locationNesaGallery":
                //   inputs[i].push(<LocationNesaDiagram
                //     key={'edl'+i+key}
                //     name={fieldName}
                //     value={value}
                //   />)
                //   break

              default:
                inputs[i].push(<p key={'edl'+i+key}>Input type not found</p>)
            }
          } else {
            inputs[i].push(<InputRhf
              key={'edl'+i+key}
              type="text"
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
              readonly={readonly}
              minLength={minLength}
              maxLength={maxLength}
              register={register}
              methods={methods}
              errors={errors}
            />)
          }
          return null;
      });
      return null;
    });
  }

  const content = inputs.map((input, i) => {
    return <div key={`doc${i}`} className="editable-document-linkage__document">{input}</div>
  })

  return (<div className={classProps.join(' ')}>
    <label className="editable-document-linkage__label">
      {props.label ? props.label : props.name}: {props.required ? <span className="small">[Required]</span> : ""}
    </label>
    {(content.length > 0)? content : "no content"}
  </div>)
}