import React, { useState, useRef } from 'react';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick'
import Table from './Table';
import Input from '../base/Input';
import Select from '../base/Select';

export function Row(props) {
  const status = props.status ? props.status : ["Open", "Closed"];

  const daysOfTheWeek = {
    "mon": "Monday",
    "tue": "Tuesday",
    "wed": "Wednesday",
    "thu": "Thursday",
    "fri": "Friday",
    "sat": "Saturday",
    "sun": "Sunday",
  }

  const id = props.id? props.id : "0";
  const error = props.error? props.error : false;
  const disabled = props.disabled? props.disabled : false;
  const required = props.required? props.required : false;

  return (
    {
      col1: <Select name={`days_${id}`} options={daysOfTheWeek} noLabel noMargin hideError error={error} disabled={disabled} required={required} />,
      col2: <Select name={`status_${id}`} options={status} noLabel noMargin hideError error={error} disabled={disabled} required={required} />,
      col3: <Input name={`timeFrom_${id}`} type="time" noLabel noMargin hideError error={error} disabled={disabled} required={required} />,
      col4: <Input name={`timeTo_${id}`} type="time" noLabel noMargin hideError error={error} disabled={disabled} required={required} />,
    }
  );
};

export default function OpeningHours(props) {
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));

  let inputProps = {};
  inputProps.disabled = props.disabled? props.disabled : false;
  inputProps.readonly = props.readonly? props.readonly : false;
  inputProps.required = props.required ? props.required : false;
  inputProps.error = props.error ? props.error : false;

  let initialRows = props.initialRows ? props.initialRows : 5;
  const [rows, setRows] = useState(initialRows);

  let initialData= [];
  for (let i = 0; i < rows; i++) {
    initialData.push(Row({
      id: i,
      disabled: inputProps.disabled,
      error: inputProps.error,
      required: inputProps.required,
      status: props.status,
    }));
  }
  const [data, setData] = useState(initialData);

  function onRemoveRow(id) {
    setRows(rows-1);
    let array =  [...data];
    array.splice(id, 1);
    setData(array);
  }

  function onAddRow() {
    setRows(rows+1);
    let array =  [...data];
    array.push(Row({id:rows}));
    setData(array);
  }

  const columns = [
    { Header: 'Day', accessor: 'col1', type: 'input' },
    { Header: 'Status', accessor: 'col2', type: 'input' },
    { Header: 'Time From', accessor: 'col3', type: 'input' },
    { Header: 'Time To', accessor: 'col4', type: 'input' },
  ];

  const recordsPerPage = 10;
  const dataTable = true;

  let classProps = ['opening-hours__wrap'];
  if (props.disabled) {classProps.push('opening-hours__wrap--disabled')}
  if (props.className) {classProps.push(props.className)}
  if (props.error) {classProps.push('opening-hours__wrap--error')}
  if (props.noLabel) {classProps.push('opening-hours__wrap--no-label')}
  if (props.noMargin) {classProps.push('opening-hours__wrap--no-margin')}

  return (
    <div ref={ref} className={classProps.join(' ')} >
      {props.noLabel? "" : 
        <label className="opening-hours__label" htmlFor={props.id ? props.id : props.name}>
          {props.label ? props.label : props.name}: {inputProps.required ? <span className="small">[Required]</span> : ""}
        </label>
      }
      {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : "" }
      <Table 
        className="opening-hours__table"
        columns={columns} 
        data={data} 
        recordsPerPage={recordsPerPage} 
        dataTable={dataTable}  
        onRemoveRow={onRemoveRow} 
        onAddRow={onAddRow}  
        {...inputProps}
      />
     {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
          <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
        </p> : "" }
      {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : "" }
      {props.children}
    </div> 
  );
};