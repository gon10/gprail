import React from 'react';
//import { faGrid } from '@fortawesome/free-solid-svg-icons';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../base/Button/Button'

export function GalleryHeader(props) {
  let classProps = ['image-context--gallery__header'];
  if (props.borders) {classProps.push('image-context--gallery__header--borders')}
  if (props.canSelect) {classProps.push('image-context--gallery__header--hovers')}
  if (props.selected) {classProps.push('image-context--gallery__header--selected')}
  if (props.rounded) {classProps.push('image-context--gallery__header--rounded')}
  if (props.disabled) {classProps.push('image-context--gallery__header--disabled')}
  if (props.fade) {classProps.push('image-context--gallery__header--fade')}
  if (props.success) {classProps.push('image-context--gallery__header--success')}
  if (props.alert) {classProps.push('image-context--gallery__header--alert')}
  if (props.warning) {classProps.push('image-context--gallery__header--warning')}
  if (props.error) {classProps.push('image-context--gallery__header--warning')}
  if (props.className) {classProps.push(props.className)}

  switch (props.size) {
    case "thumbnail":
    case "thumb":
    case "150":
      classProps.push('image-context--gallery__header--size-150')
      break;
    case "mobile": 
    case "mob":
    case "360":
      classProps.push('image-context--gallery__header--size-360')
      break;
    case "480":
      classProps.push('image-context--gallery__header--size-480')
      break;
    case "700":
      classProps.push('image-context--gallery__header--size-700')
      break;
    case "tablet":
    case "tab":
    case "768":
      classProps.push('image-context--gallery__header--size-768')
      break;
    case "regular":
    case "reg":
    case "1024":
      classProps.push('image-context--gallery__header--size-1024')
      break;
    case "1400": 
      classProps.push('image-context--gallery__header--size-1400')
      break;
    case "highdefinition":
    case "hd":
    case "1920":
      classProps.push('image-context--gallery__header--size-1920')
      break;
    case "original":
      classProps.push('image-context--gallery__header--size-original')
      break;
    case "fullwidth": 
      classProps.push('image-context--gallery__header--size-fullwidth')
      break;
    default: 
      classProps.push('image-context--gallery__header--size-full')
  }

  return (
    <div className={classProps.join(' ')}>
      <div className="image-context--gallery__header__name">
        <h2 className="image-context--gallery__header__title">{props.title? props.title : "Gallery"}</h2>
        {props.subtitle? <p className="image-context--gallery__header__subtitle">{props.subtitle}</p> : null}
      </div>
      <div className="image-context--gallery__header__controls">
        <div className="image-context--gallery__header__controls__sizes">
          <Button 
            className="image-context--gallery__header__button--square"
            action="tertiary"
            onClick={(e) => props.imageSize(e.currentTarget.data("size"))}
            data-size="thumb">
            <span className="tempIcon icon__grid-s">S</span>
          </Button>
          <Button 
            className="image-context--gallery__header__button--square"
            action="tertiary"
            onClick={(e) => props.imageSize(e.currentTarget.data("size"))}
            data-size="mobile">
            <span className="tempIcon icon__grid-m">M</span>
          </Button>
          <Button 
            className="image-context--gallery__header__button--square"
            action="tertiary"
            onClick={(e) => props.imageSize(e.currentTarget.data("size"))}
            data-size="tablet">
            <span className="tempIcon icon__grid-l">L</span>
          </Button>
        </div>
        {props.canSelect? 
          <Button 
            className="image-context--gallery__header__button"
            action="secondary"
            onclick={props.onCanSelect? props.onCanSelect : () => console.log("CanSelect clicked")}
            label="Select"
          />
        : null}
      </div>
      {props.children}
    </div>
  )
};