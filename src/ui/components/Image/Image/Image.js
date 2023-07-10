import React, { useEffect, useState } from 'react'
import _uniqueId from 'lodash/uniqueId'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrown } from '@fortawesome/free-solid-svg-icons'

export default function Image(props) {
  const [thisId] = useState(_uniqueId());
  const [isValid, setIsValid] = useState(true);

  let classProps = ['image__wrap'];
  if (props.borders) {classProps.push('image__wrap--borders')}
  if (props.canSelect) {classProps.push('image__wrap--hovers')}
  if (props.selected) {classProps.push('image__wrap--selected')}
  if (props.rounded) {classProps.push('image__wrap--rounded')}
  if (props.disabled) {classProps.push('image__wrap--disabled')}
  if (props.fade) {classProps.push('image__wrap--fade')}
  if (props.success) {classProps.push('image__wrap--success')}
  if (props.alert) {classProps.push('image__wrap--alert')}
  if (props.warning) {classProps.push('image__wrap--warning')}
  if (props.error || !isValid) {classProps.push('image__wrap--warning')}
  if (props.className) {classProps.push(props.className)}

  switch (props.size) {
    case "thumbnail":
    case "thumb":
    case "150":
      classProps.push('image__wrap--size-150')
      break;
    case "mobile": 
    case "mob":
    case "360":
      classProps.push('image__wrap--size-360')
      break;
    case "480":
      classProps.push('image__wrap--size-480')
      break;
    case "700":
      classProps.push('image__wrap--size-700')
      break;
    case "tablet":
    case "tab":
    case "768":
      classProps.push('image__wrap--size-768')
      break;
    case "regular":
    case "reg":
    case "1024":
      classProps.push('image__wrap--size-1024')
      break;
    case "1400": 
      classProps.push('image__wrap--size-1400')
      break;
    case "highdefinition":
    case "hd":
    case "1920":
      classProps.push('image__wrap--size-1920')
      break;
    case "original":
      classProps.push('image__wrap--size-original')
      break;
    case "fullwidth": 
      classProps.push('image__wrap--size-fullwidth')
      break;
    default: 
      classProps.push('image__wrap--size-fullwidth')
  }


  const srcUrl = props.src? props.src.split('=')[0] : ""
  const src = `${srcUrl}?size=${props.size}`

  
  let imageProps = {
    id: props.id ? props.id : thisId,
    className: "image",
    src: props.src? props.src || Error : "",
    name: props.name? props.name : "image-name",
    title: props.title? props.title : "image-title",
    alt: props.alt? props.alt : "image alt text",
    longdesc: props.longdesc? props.longdesc : null,
    height: props.height? props.height : null,
    width: props.width? props.width: null,
    sizes: props.sizes? props.sizes : null,
    onClick: props.onClick? props.onClick : null,
  };

let image = [];

  useEffect(() => {
    if (src) setIsValid(true)
  }, [src])

  if (!isValid) {
    image = <div className="image image--error warning">
      <p><FontAwesomeIcon icon={faFrown} className="image--error__icon" /></p>
      <p>Image not found</p>
      </div>
  } else {
    image = <img 
      {...imageProps} 
      src={src}
      alt={props.alt? props.alt : "image alt text"} 
      loading="lazy"
      onError={() => setIsValid(false)}
    />
  }

  return (
    <div className={classProps.join(' ')}>
      {image}
      {props.children}
    </div>
  )
};