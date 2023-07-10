import React, { useState, useRef } from 'react';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../Helpers/OutsideClick';
import Select from '../base/Select';

export default function TrackId(props) {
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);
  OutsideClick(ref, () => setShowHelp(false));

  // const { elr } = ElrContext? useContext(ElrContext) : null;
  // console.log(elr)

  // const [trackIds, setTrackIds] = useState(false)

  // useEffect(() => {
  //   const tracks = (elr.length > 0) ? 
  //   elr[0].trackIds ?
  //     elr[0].trackIds.map((track) => {
  //         return { value: `${track.trackId}`, label: `${track.trackId}: ${track.displayText}` }
  //     }) 
  //   : [{ value: null, label: "No Track Ids found for this location" }]
  //   : null
  //   setTrackIds(tracks)
  // }, [elr])

  let trackIds = [];
  if(props.options && props.methods){
    let tracks = global.structuredClone(props.methods.getValues(props.options))
    if(tracks && tracks[0] && tracks[0].trackIds && tracks[0].trackIds.length > 0){
      trackIds = tracks[0].trackIds.map((track) => {
                return { value: `${track.trackId}`, label: `${track.trackId}: ${track.displayText}` }
            }) 
    }else {
      trackIds=[{ value: null, label: "No Track Ids found for this location" }]
    }
  }

  let value = null;
  if(props.methods){
    value=props.methods.getValues(props.name)
  }

  let classProps = ['track-id__wrap'];
  if (props.disabled) { classProps.push('track-id__wrap--disabled') }
  if (props.className) { classProps.push(props.className) }
  if (props.error || (!value)) { classProps.push('track-id__wrap--error') }
  if (props.noLabel) { classProps.push('track-id__wrap--no-label') }
  if (props.noMargin) { classProps.push('track-id__wrap--no-margin') }

  let inputProps = {
    id: props.id ? props.id : "trackId",
    label: props.label ? props.label : "Track ID",
    name: props.name ? props.name : "trackId",
    className: "track-id",
    disabled: props.disabled,
    readonly: props.readonly,
    error: (!value && props.required) ? {type: "required"} : props.error,
    required: props.required,
    placeholder: props.placeholder,
    noMargin: true,
    noLabel: true,
    // hideError: true,
    options: trackIds,
    onChange: props.onChange,
    onBlur: props.onBlur,
    methods: props.methods,
    rhf: props.rhf,
    setData: props.setData,
    additionalNameToChange: props.additionalNameToChange
  };

  return (
    <div ref={ref} className={classProps.join(' ')} >
      {props.noLabel ? "" :
        <label className="track-id__label" htmlFor={props.id ? props.id : props.name}>
          {props.label ? props.label : props.name}: {props.required ? <span className="small">[Required]</span> : ""}
        </label>
      }
      {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : ""}

      <Select {...inputProps} />

      {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
        <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
      </p> : ""}
      {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : ""}
      {props.children}
    </div>
  )
}