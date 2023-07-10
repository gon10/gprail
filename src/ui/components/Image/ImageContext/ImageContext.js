import React, { useState, useRef, useEffect } from 'react';
import { faInfoCircle, faExclamationTriangle, faMinimize, faDownload, faImage, faMagnifyingGlassPlus, faMagnifyingGlassMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OutsideClick from '../../../../Helpers/OutsideClick'
import Button from '../../../base/Button'
import Image from '../Image/Image'
//import { ImageTitle } from '../Image/ImagePlugins'
import ImageCollection from '../ImageCollection/ImageCollection'
import { ImageTitle } from '../Image/ImagePlugins';

export default function ImageContext(props) {
  const ref = useRef();
  const [showHelp, setShowHelp] = useState(false);

  OutsideClick(ref, () => setShowHelp(false));

  let classProps = ['image-context']
  if (props.className) { classProps.push(props.className) }
  let content = []

  let imgProps = {
    id: props.id ? props.id : null,
    src: props.src ? props.src : null,
    name: props.name ? props.name : null,
    title: props.title ? props.title : null,
    alt: props.alt ? props.alt : null,
    longdesc: props.longdesc ? props.longdesc : null,
    height: props.height ? props.height : null,
    width: props.width ? props.width : null,
    sizes: props.sizes ? props.sizes : null,
    selected: props.selected ? props.selected : null,
    borders: props.borders ? props.borders : null,
    canSelect: props.canSelect ? props.canSelect : null,
    rounded: props.rounded ? props.rounded : null,
    disabled: props.disabled ? props.disabled : null,
    className: props.imageClassName ? props.imageClassName : null,
    size: props.size ? props.size : "thumb",
    fade: props.fade ? props.fade : null,
    onClick: props.onClick ? props.onClick : null,
  }

  const lightboxProps = {
    id: props.id ? props.id : null,
    src: props.src ? props.src : null,
    alt: props.alt ? props.alt : null,
    title: props.title ? props.title : props.images ? props.images[0].title : null,
    name: props.name ? props.name : null,
    borders: props.borders ? props.borders : false,
    rounded: props.rounded ? props.rounded : null,
    disabled: props.disabled ? props.disabled : null,
    className: props.className ? props.className : null,
    onClick: props.onClick ? props.onClick : null,
  }

  //const [imageSize, setImageSize] = useState(imgProps.size);
  const [lightboxClose, setLightboxClose] = useState(true)
  const [lightboxSelected, setLightboxSelected] = useState(lightboxProps)
  const [lightboxSize, setLightboxSize] = useState('768')
  const [zoom, setZoom] = useState(0)

  useEffect(() => {
    if (props.lightboxSelected) {
      setLightboxSelected(props.lightboxSelected)
    }
  }, [props.lightboxSelected])

  const collectionProps = {
    name: props.name ? props.name : 'testCollection',
    title: props.title ? props.title : 'Test image collection',
    images: props.images ? props.images : [],
    disabled: props.disabled ? props.disabled : false,
    size: props.size ? props.size : "thumb",
    canSelect: props.canSelect ? props.canSelect : true,
    onClick: props.onClick ? props.onClick : null,
  }

  function filmstripClick(e, imageArray) {
    const thisImageId = e.currentTarget.id;
    imageArray.map((image) => {
      if (image.id === thisImageId) {
        setLightboxSelected(image);
        //navigate("/app/splitscreen/view" ,{state: {id: thisImageId}})
        props.filmstripClick && props.filmstripClick(e, imageArray)
      }
      return null;
    })
  }

  function handleTitleClick(e, imageArray) {
    const thisImageId = e.currentTarget.id;
    imageArray.map((image) => {
      if (image.id === thisImageId) {
        setLightboxSelected(image);
      }
      return null;
    })

    if (props.onClick) props.onClick(e)
    setLightboxClose(false);
  }

  switch (props.type) {
    case "image":
      const fullscreenContext = props.className && props.className.includes("fullscreen-lightbox")
      classProps.push('image-context--image')
      classProps.push(props.zoom ? `image-context--image--zoom${props.zoom}` : null)
      content = <Image {...imgProps} className={fullscreenContext ? imgProps.className + ' fullscreen-img' : imgProps.className}>
                  {!fullscreenContext && (
                    <ImageTitle {...imgProps} />
                  )}
                </Image>
      break;
    case "tableCell":
      classProps.push('image-context--td')
      content = <Image {...imgProps} borders >
        {/*<ImageTitle {...imgProps} />*/}
      </Image>
      break;
    case "lightbox":
      classProps.push('image-context--lightbox')
      content = <>
        <div className="image-context--lightbox__header">
          {props.noTitle ? "" : <h3 className="image-context--lightbox__title">{props.title ? props.title : lightboxSelected ? lightboxSelected.alt : "Gallery"}</h3>}

          <div className="image-context--lightbox__controls">
            <Button action="tertiary"
              className="image-context--lightbox__button"
              title="Zoom out"
              disabled={zoom < -3}
              onClick={() => {
                //setLightboxSize("360")
                setZoom(zoom - 1)
              }}
              label={<FontAwesomeIcon icon={faMagnifyingGlassMinus} className="image-context--lightbox__icon" />}
            />
            <Button action="tertiary"
              disabled={zoom === 0}
              title="Reset zoom"
              className="image-context--lightbox__button"
              onClick={() => {
                setLightboxSize("768")
                setZoom(0)
              }}
              label={<FontAwesomeIcon icon={faImage} className="image-context--lightbox__icon" />}
            />
            <Button action="tertiary"
              className="image-context--lightbox__button"
              disabled={zoom > 9}
              title="Zoom in"
              onClick={() => {
                setLightboxSize("fullscreen")
                setZoom(zoom + 1)
              }}
              label={<FontAwesomeIcon icon={faMagnifyingGlassPlus} className="image-context--lightbox__icon" />}
            />
            <a
              className="button button--tertiary image-context--lightbox__button"
              title="Download original"
              href={lightboxSelected ? `${lightboxSelected.src.split('=')[0]}=original`
                : null}
              target="_blank" rel="noopener noreferrer" download>
              <FontAwesomeIcon icon={faDownload} className="image-context--lightbox__icon" />
            </a>
          </div>

          {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : ""}
        </div>
        <ImageContext {...collectionProps}
          type="lightbox-fullscreen"
          lightboxClose={lightboxClose}
          setLightboxClose={setLightboxClose}
          filmstripClick={filmstripClick}
          lightboxSelected={lightboxSelected}
        />

        <ImageContext {...lightboxSelected} canSelect={false} size={lightboxSize} type="image" zoom={zoom} onClick={(e) => handleTitleClick(e, props.images)} />
        {props.images.length > 1 && <ImageContext
          {...collectionProps}
          type="filmstrip"
          noTitle
          canSelect={true}
          onClick={(e) => filmstripClick(e, props.images)}
        />}

        {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
          <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
        </p> : ""}
        {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : ""}
      </>
      break;
    case "lightbox-fullscreen":
      classProps.push(props.lightboxClose ? 'image-context--lightbox-fullscreen image-context--lightbox-fullscreen--close' : 'image-context--lightbox-fullscreen')
      content = <>
        <div className="image-context--lightbox-fullscreen__controls">
          <a
            className="button button--tertiary image-context--lightbox-fullscreen__button"
            href={props.lightboxSelected ? props.lightboxSelected.src : null}
            target="_blank" rel="noopener noreferrer" download>
            <FontAwesomeIcon icon={faDownload} className="image-context--lightbox-fullscreen__icon" />
          </a>
          <Button action="tertiary"
            className="image-context--lightbox-fullscreen__button"
            onClick={() => props.setLightboxClose(true)}
            label={<FontAwesomeIcon icon={faMinimize} className="image-context--lightbox-fullscreen__icon" />}
          />
        </div>
        <ImageContext {...lightboxSelected} className={lightboxSelected.className + ' fullscreen-lightbox'} canSelect={false} size="fullwidth" type="image" />
        <ImageContext
          {...collectionProps}
          type="filmstrip"
          noTitle
          canSelect={true}
          onClick={(e) => filmstripClick(e, props.images)} />
      </>
      break;
    case "gallery":
      classProps.push('image-context--gallery')
      content = <>
        <ImageContext {...collectionProps}
          type="lightbox-fullscreen"
          lightboxClose={lightboxClose}
          setLightboxClose={setLightboxClose}
          filmstripClick={filmstripClick}
          lightboxSelected={lightboxSelected}
        />

        <div className="image-context--gallery__header__wrap">
          {props.header ? props.header : props.noTitle ? null : <h3>{props.title ? props.title : "Gallery"}</h3>}
          {props.helpText ? <FontAwesomeIcon icon={faInfoCircle} className={showHelp ? "input__help input__help--active" : "input__help"} onClick={() => setShowHelp(true)} /> : ""}
        </div>

        <ImageCollection {...collectionProps}
          onClick={(e) => handleTitleClick(e, props.images)}
        />

        <div className="image-context--gallery__footer__wrap">
          {props.footer}
          {props.helpText ? <p className={showHelp ? "input__help-text input__help-text--show" : "input__help-text"}>
            <FontAwesomeIcon icon={faInfoCircle} className="input__icon" /> {props.helpText}
          </p> : ""}
          {(props.error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {props.error.message}</p> : ""}
        </div>
      </>
      break;
    case "filmstrip":
      classProps.push('image-context--filmstrip')
      content = <ImageCollection {...collectionProps} borders={true} size="thumb" canSelect={true} />
      break;
    default:
      content = <ImageCollection {...collectionProps} />
      break;
  }

  return (
    <div ref={ref} className={classProps.join(' ')}>
      {content}
      {props.children}
    </div>
  )
};