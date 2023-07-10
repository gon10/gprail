import React, { useEffect, useState } from 'react';
import Image from '../Image/Image';
import { ImageTitle } from '../Image/ImagePlugins';

export default function ImageCollection(props) {
  const [images, setImages] = useState(props.images);

  useEffect(() => {
    setImages(props.images)
  }, [props.images])

  let classProps = ['image-collection'];

  let imgProps = {
    borders: props.borders? props.borders : null,
    canSelect: props.canSelect? props.canSelect : null,
    rounded: props.rounded? props.rounded : null,
    disabled: props.disabled? props.disabled : null,
    className: props.imageClassName? props.imageClassName : null,
    size: props.size? props.size : "thumb",
    fade: props.fade? props.fade : null,
    onClick: props.onClick? props.onClick : null,
  }

  function handleImageSelect(thisImageId, imageArray) {
    let newImages = imageArray.map((image) => {
      if (!props.multiSelect && image.id !== parseInt(thisImageId)) {
        image.selected = false
      }
      if (image.id === parseInt(thisImageId)) {
        image.selected = image.selected? false : true
        return image
      } else {
        return image
      }
    })
    setImages(newImages) 
  }

  if (props.canSelect || props.multiSelect) {
    imgProps.onClick = (e) => {
      handleImageSelect(e.currentTarget.id, images)
      if(props.onClick && typeof props.onClick === "function"){
        props.onClick(e)
      }else {
        console.log("clicked image "+e.currentTarget.id)
      }
    }
  }

  const content = images.map((image) => {
    return <Image {...imgProps} 
      key={image.id}
      id={image.id ? image.id : null}
      src={image.src? image.src : null}
      name={image.name? image.name : null}
      title={image.title? image.title : null}
      alt={image.alt? image.alt : null}
      longdesc={image.longdesc? image.longdesc : null} 
      height={image.height? image.height : null} 
      width={image.width? image.width: null} 
      sizes={image.sizes? image.sizes : null}
      selected={image.selected? image.selected : null}
    >
      <ImageTitle
        {...imgProps} 
        id={image.id ? image.id : null}
        title={image.title? image.title : null}
        alt={image.alt? image.alt : null}
        longdesc={image.longdesc? image.longdesc : null} 
      />
    </Image>
  })

  return (
    <div className={classProps.join(' ')}>
      {content}
      {props.children}
    </div>
  )
};