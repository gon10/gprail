import React from 'react';
import { faMaximize } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function ImageTitle(props) {
  let classProps = ['image__title'];
  if (props.borders) {classProps.push('image__title--borders')}
  if (props.canSelect) {classProps.push('image__title--hovers')}
  if (props.selected) {classProps.push('image__title--selected')}
  if (props.rounded) {classProps.push('image__title--rounded')}
  if (props.disabled) {classProps.push('image__title--disabled')}
  if (props.fade) {classProps.push('image__title--fade')}
  if (props.success) {classProps.push('image__title--success')}
  if (props.alert) {classProps.push('image__title--alert')}
  if (props.warning) {classProps.push('image__title--warning')}
  if (props.error) {classProps.push('image__title--warning')}
  if (props.className) {classProps.push(props.className)}

  switch (props.size) {
    case "thumbnail":
    case "thumb":
    case "150":
      classProps.push('image__title--size-150')
      break;
    case "mobile": 
    case "mob":
    case "360":
      classProps.push('image__title--size-360')
      break;
    case "480":
      classProps.push('image__title--size-480')
      break;
    case "700":
      classProps.push('image__title--size-700')
      break;
    case "tablet":
    case "tab":
    case "768":
      classProps.push('image__title--size-768')
      break;
    case "regular":
    case "reg":
    case "1024":
      classProps.push('image__title--size-1024')
      break;
    case "1400": 
      classProps.push('image__title--size-1400')
      break;
    case "highdefinition":
    case "hd":
    case "1920":
      classProps.push('image__title--size-1920')
      break;
    case "original":
      classProps.push('image__title--size-original')
      break;
    case "fullwidth": 
      classProps.push('image__title--size-fullwidth')
      break;
    default: 
      classProps.push('image__title--size-full')
  }

  let titleProps = {
    id: props.id ? props.id : null,
    title: props.title? props.title : "Image title",
    alt: props.alt? props.alt : "Image alt text",
    longdesc: props.longdesc? props.longdesc : null,
    onClick: props.onClick? props.onClick : null,
  };

  return (
    <div className={classProps.join(' ')} { ...titleProps }>
      <FontAwesomeIcon icon={faMaximize} className="image__title__icon" />
      <p className="image__title__title">{titleProps.title}</p>
      <p className="image__title__alt">{titleProps.alt}</p>
      {props.children}
    </div>
  )
};