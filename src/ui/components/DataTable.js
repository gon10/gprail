import React, { useState, useRef } from 'react';
import { Controller } from "react-hook-form";
import { faInfoCircle, 
  // faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick'
import Table from './Table';
import InputRhf from '../base/InputRhf';
import Boolean from '../base/Boolean';
import  { DateTimeRangeWrap } from './DateTimeRange';


export function Row({ control, register, methods, errors, ...props }) {
  
  const id = props.id ? props.id : "0";
  const arrayName = props.name ? props.name : "ArrayNameRequired";

  const row = props.row;
  const rowContent = {};
  row.map((r) => {
    switch (r.component) {
      case "textField":
        rowContent[r.accessor] = 
          <Controller
            control={control}
            name={r.name ? `${arrayName}[${id}].${r.name}` : `name-${id}`}
            render={() => (
              <InputRhf
                id={`${r.name}-${id}`}
                name={r.name ? `${arrayName}[${id}].${r.name}` : `name-${id}`}
                type={r.type ? r.type : "text"}
                value={r.value ? r.value : ""}
                //onChange={r.onChange ? (e) => r.onChange(e) : ""}
                noLabel 
                noMargin 
                // hideError
                disabled={r.disabled}
                readonly={r.readonly}
                required={r.required}
                minLength={r.minLength}
                maxLength={r.maxLength}
                isUniqueOnTable={r.isUniqueOnTable}
                numRows={r.numRows}
                register={register}
                methods={methods}
                errors={errors}
                error={props.error}
                getRecordsForField={props.getRecordsForField}
                allValues={props.allValues}
                //recordsForField={recordsForField}
              />
            )}
          />  
        break;
      case "integerField":
        rowContent[r.accessor] = 
          <Controller
            control={control}
            name={r.name ? `${arrayName}[${id}].${r.name}` : `name-${id}`}
            rules={{required: r.required ? true: false}}
            render={() => { return(
              <InputRhf
                id={`${r.name}-${id}`}
                type="number"
                name={r.name ? `${arrayName}[${id}].${r.name}` : `name-${id}`}
                accessor={r.accessor}
                noLabel 
                noMargin 
                // hideError
                required={r.required}
                min={r.min}
                minLength={r.minLength}
                maxLength={r.maxLength}
                isUniqueOnTable={r.isUniqueOnTable}
                register={register}
                methods={methods}
                errors={errors}
                error={props.error}
                getRecordsForField={props.getRecordsForField}
                allValues={props.allValues}
                // recordsForField={recordsForField}
              />
            )}}
          />  
        break
      case "booleanField":
        rowContent[r.accessor] = <Boolean
          id={`${r.name}-${id}`}
          name={r.name ? `${arrayName}[${id}].${r.name}` : `name-${id}`}
          noLabel 
                noMargin 
                hideError
          required={r.required}
          //displayType={r.displayType}
          //options={r.options}
          register={register}
          methods={methods}
          errors={errors}
          // error={props.error}
          control={control}
          defaultValue={r.defaultValue}
        />
        break
      case "temporalField":
          
        rowContent[r.accessor] = 
        <DateTimeRangeWrap className={['date-time-range__wrap ']} noLabel noMargin id={`${r.name}-${id}`} name={r.name ? `${arrayName}[${id}].${r.name}` : `name-${id}`}>
          <Controller
            control={control}
            name={r.name ? `${arrayName}[${id}].${r.name}.from` : `name-${id}`}
            rules={{required: r.required ? true: false}}
            render={() => { return(
              <InputRhf
                id={`${r.name}-${id}-from`}
                type="datetime-local"
                name={r.name ? `${arrayName}[${id}].${r.name}.from` : `name-${id}`}
                accessor={r.accessor}
                noLabel 
                noMargin 
                // hideError
                required={r.required}
                min={r.min}
                minLength={r.minLength}
                maxLength={r.maxLength}
                isUniqueOnTable={r.isUniqueOnTable}
                register={register}
                methods={methods}
                errors={errors}
                error={props.error}
                getRecordsForField={props.getRecordsForField}
                allValues={props.allValues}
                dataLessThan={`${arrayName}[${id}].${r.name}.until`}
                // recordsForField={recordsForField}
              />
            )}}
          /> 
            <Controller
            control={control}
            name={r.name ? `${arrayName}[${id}].${r.name}.until` : `name-${id}`}
            rules={{required: r.required ? true: false}}
            render={() => { return(
              <InputRhf
                id={`${r.name}-${id}-until`}
                type="datetime-local"
                name={r.name ? `${arrayName}[${id}].${r.name}.until` : `name-${id}`}
                accessor={r.accessor}
                noLabel 
                noMargin 
                // hideError
                required={r.required}
                min={r.min}
                minLength={r.minLength}
                maxLength={r.maxLength}
                isUniqueOnTable={r.isUniqueOnTable}
                register={register}
                methods={methods}
                errors={errors}
                error={props.error}
                getRecordsForField={props.getRecordsForField}
                allValues={props.allValues}
                dataMoreThan={`${arrayName}[${id}].${r.name}.from`}
                // recordsForField={recordsForField}
              />
            )}}
          />  
        </DateTimeRangeWrap>
        
        break
      default:
        rowContent[r.accessor] = 
          <Controller
            control={control}
            name={r.name ? `${arrayName}[${id}].${r.name}` : `name-${id}`}
            render={() => (
              <InputRhf
                id={`${r.name}-${id}`}
                name={r.name ? `${arrayName}[${id}].${r.name}` : `name-${id}`}
                type={r.type ? r.type : "text"}
                value={r.value ? r.value : ""}
                //onChange={r.onChange ? (e) => r.onChange(e) : ""}
                noLabel 
                noMargin 
                // hideError
                disabled={r.disabled}
                required={r.required}
                minLength={r.minLength}
                maxLength={r.maxLength}
                isUniqueOnTable={r.isUniqueOnTable}
                numRows={r.numRows}
                register={register}
                methods={methods}
                errors={errors}
                getRecordsForField={props.getRecordsForField}
                allValues={props.allValues}
              />
            )}
          />  
    }
    return null;
  });
  //console.log(rowContent);
  return rowContent;
};

export default function DataTable({ control, register, methods, errors, ...props }) {
  const id = props.id ? props.id : 0;
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));

  let allValues = methods.getValues();
  //console.log(allValues)
  let inputProps = {
    disabled: props.disabled ? props.disabled : false,
    readonly: props.readonly ? props.readonly : false,
    required: props.required ? props.required : false,
    error: props.error ? props.error : false,
    tabletView: props.tabletView ? props.tabletView : false,
    mobileView: props.mobileView ? props.mobileView : false,
    fullWidth: props.fullWidth ? props.fullWidth : true,
  };
  
  const structure = props.structure ? props.structure : {
    headers: [
      { Header: 'No rows supplied', accessor: 'row', type: 'input' }
    ],
    rows: [
      { accessor: 'row', component: 'Input', name: 'row' }
    ]
  };

  let initialRows = props.initialRows ? props.initialRows : 1;
  const [rows, setRows] = useState([...Array(initialRows).keys()]);


  let tableData = [];
  for (let i = 0; i < rows.length; i++) {
    tableData.push(Row({
      id: parseInt(id) + parseInt(parseInt(rows[i])),
      name: props.name,
      disabled: inputProps.disabled,
      error: inputProps.error,
      required: inputProps.required,
      minLength: props.minLength,
      isUniqueOnTable: props.isUniqueOnTable,
      maxLength: props.maxLength,
      status: props.status,
      row: structure.rows,
      register: register,
      methods: methods,
      errors: errors,
      control: control,
      getRecordsForField: true,
      allValues: allValues
    }));
    }

    

    
  
  
  function onRemoveRow(id, e) {
    e.stopPropagation();
    e.preventDefault();
    let itemToRemove = tableData[id];
    for (const entries of Object.entries(itemToRemove)) {
      if(entries[0]=== "effectiveDates"){
        props.unregister(entries[1].props.name+".from",{ keepDirty: true });
        props.unregister(entries[1].props.name+".until",{ keepDirty: true });
      }else {
       props.unregister(entries[1].props.name,{ keepDirty: true });
      }
    }
    if(tableData.length >1){
      let rowsArray = [...rows];
      rowsArray.splice(id, 1);
      setRows( rowsArray)
      // setRows(rows - 1);

      // let dataArray = [...data];
      // dataArray.splice(id, 1);
      // setData( dataArray);
    }
    
  }

  function onAddRow(e) {
    e.stopPropagation();
    e.preventDefault();

    setRows(curr=>[...curr, curr[curr.length-1]+1])
  }

  

  const recordsPerPage = 10;
  const dataTable = true;

  let classProps = ['res-table--datatable datatable__wrap'];
  if (props.disabled) { classProps.push('datatable__wrap--disabled') }
  if (props.className) { classProps.push(props.className) }
  if (props.error) { classProps.push('datatable__wrap--error') }
  if (props.noLabel) { classProps.push('datatable__wrap--no-label') }
  if (props.noMargin) { classProps.push('datatable__wrap--no-margin') }
  if (props.fullWidth) { classProps.push('datatable__wrap--full-width') }

  return (
    <div ref={ref} className={classProps.join(' ')} >
      {props.noLabel ? "" :
        <>
          <label className="res-table--datatable__label datatable__label" htmlFor={props.id ? props.id : props.name}>
            {props.label ? props.label : props.name}: {inputProps.required ? <span className="small">[Required]</span> : ""}
          </label>
          {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : ""}
        </>
      }
      <Table
        className="res-table--datatable datatable__table"
        columns={structure.headers}
        data={tableData}
        dataTable={dataTable}
        onRemoveRow={onRemoveRow}
        onAddRow={onAddRow}
        recordsPerPage={recordsPerPage}
        {...inputProps}
      />
      {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
        <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
      </p> : ""}
      {/* {(props.error && !props.hideError) ?  <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {error}</p> : ""} */}
      {props.children}
    </div>
  );
};