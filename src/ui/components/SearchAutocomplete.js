import React, { useState, useRef } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick';

function SearchAutocomplete(props) {
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));

  const [thisId] = useState(_uniqueId('search-autocomplete-'));
  const id = props.id ? props.id : thisId;

  let classProps = ['evo-search-autocomplete__wrap'];
  if (props.disabled) {classProps.push('evo-search-autocomplete__wrap--disabled')}
  if (props.className) {classProps.push(props.className)}
  if (props.error) {classProps.push('evo-search-autocomplete__wrap--error')}
  if (props.noLabel) {classProps.push('evo-search-autocomplete__wrap--no-label')}
  if (props.noMargin) {classProps.push('evo-search-autocomplete__wrap--no-margin')}

  let inputProps = {
    className: "evo-search-autocomplete",
    id: id,
    name: props.name,
    value: props.value ?  props.value : "",
    disabled: props.disabled? props.disabled : null,
    readonly: props.readonly? props.readonly : null,
    required: props.required ? props.required : false,
    placeholder: props.placeholder? props.placeholder : null,
  };

  // note: the id field is mandatory
  const items = props.items? props.items : [];

  const handleOnSearch = props.onSearch? props.onSearch : (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(string, results)
  }

  const handleOnHover = (result) => {
    // the item hovered
    //console.log(result)
  }

  const handleOnSelect = (item) => {
    // the item selected
    //console.log(item)
  }

  const handleOnFocus = (e) => {
    //console.log('Focused')
    let newId = e.target.closest('.evo-search-autocomplete__wrap').id;
    e.target.id = "sa-"+newId;
    //console.log("sa-"+newId);
  }

  const formatResult = (item) => {
    return (
      <span className="evo-search-autocomplete__result__item" key={item._id.$oid} data-id={item._id.$oid}>{item.name}</span>
    )
  }

  const styling = {
    height: "32",
    border: "unset",
    borderRadius: "unset",
    backgroundColor: "#ffffff",
    boxShadow: "unset",
    hoverBackgroundColor: "rgba(0,0,0,0.05)",
    color: "unset",
    fontSize: "unset",
    fontFamily: "unset",
    iconColor: "unset",
    lineColor: "unset",
    placeholderColor: "unset",
    clearIconMargin: "unset",
    searchIconMargin: "unset"
  };

  const onChange = props.onChange? props.onChange : handleOnSelect;

  return (
    <div ref={ref} className={classProps.join(' ')} id={id} >
      {props.noLabel? "" : 
        <label className="evo-search-autocomplete__label" htmlFor={props.id ? props.id : props.name}>
          {props.label ? props.label : props.name}: {inputProps.required ? <span className="small">[Required]</span> : ""}
        </label>
      }
      {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : "" }
      
      <ReactSearchAutocomplete
        items={items}
        onSearch={handleOnSearch}
        onHover={handleOnHover}
        onSelect={onChange}
        onFocus={handleOnFocus}
        autoFocus={props.autoFocus? true : false}
        formatResult={formatResult}
        styling={styling}
      />
      {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
          <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
        </p> : "" }
      {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : "" }
      {props.children}
    </div>
  )
}

export default SearchAutocomplete;