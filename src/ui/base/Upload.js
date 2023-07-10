import ImageContext from '../components/Image/ImageContext/ImageContext'
import React, {useEffect, useState} from 'react';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faCamera, faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons'
import { ImageTitle } from '../components/Image/Image/ImagePlugins'
import { changeValueByPath, makeSource } from '../../Helpers/utils';

export default function Upload(props) {
  const [file, setFile] = useState(null);
  const [src, setSrc] = useState('')
  const [title, setTitle] = useState(props.label ? props.label : props.name);
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [images, setImages] = useState([
    {
      src: src,
      title: title,
      alt: title,
      id: props.name,
      plugins: [ImageTitle]
    }
  ])

  useEffect(() => {
    const values = props.methods.getValues()

    if (values && values[props.name]) {
      setFile(values[props.name])
      setSrc(makeSource(values[props.name]))
      setImages([{
        src: makeSource(values[props.name]),
        title,
        alt: title,
        id: props.name,
        plugins: [ImageTitle]
      }])
    }
  }, [props.methods.getValues])

  useEffect(() => {
    const src = makeSource(file)
    setSrc(src)
  }, [file])


  const apiLocation = `${process.env.REACT_APP_BASE_URL}/api/railhub/secured/attachment`

  const handleChange = (e) => {
    const thisFile = e.target.files[0]
    if (thisFile) {
      let { name: fileName, size } = thisFile;
      let fileSize = (size / 1000).toFixed(2);
      let fileNameAndSize = `${fileName} - ${fileSize}KB`;
      //console.log(thisFile);
      //console.log(fileSize);
      //console.log(fileNameAndSize);
      setTitle(fileNameAndSize);
      setTitle("Loading...")
    }
  }

  const handleUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoaded(false)
    setError(null)

    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    /*for (const pair of formData.entries()) {
      console.log(`${pair[0]}, ${pair[1]}`);
    }*/ 
    axios.post(apiLocation, formData)
      .then(
        (result) => {
          if (result.data.success) {
            setIsLoaded(true)

            const file = result.data.data
            file.checksum = String(file.checksum)

            setFile(file);
            setTitle("Image Uploaded")

            const image = {
              src:  makeSource(result.data.data),
              title,
              alt: title,
              id: result.data.data.attachmentId,
              plugins: [ImageTitle]
            }

            setImages([image])
            
            if (file && file.attachmentId) {
              let copy = global.structuredClone(props.methods.getValues());
              changeValueByPath(copy, props.name, file);
  
              props.setData(copy)
            }
          } else {
            setError({message: "Upload Failed. Please try again."})
            setTitle(props.label ? props.label : props.name)
            setIsLoaded(true)
            console.log(result)
          }
        },
        (error) => {
          setError(error)
          setTitle(props.label ? props.label : props.name)
          setIsLoaded(true)
          console.log(error)
        }
      )
  }

  let classProps = ['upload__wrap'];
  if (props.disabled) {classProps.push('upload__wrap--disabled')}
  if (props.fullWidth) {classProps.push('upload__wrap--full-width')}
  if (props.className) {classProps.push(props.className)}
  if (file && isLoaded && !error) {classProps.push('upload__wrap--success')}

  let inputProps = {
    type: "file",
    className: "upload",
    id: props.id ? props.id : props.name,
    name: props.name,
    accept: props.accept? props.accept : "image/png, image/jpeg"
  };
  if (props.value) {inputProps.value = props.value}
  if (props.disabled) {inputProps.disabled = props.disabled}
  if (props.readOnly) {inputProps.readOnly = props.readOnly}
  if (props.disabled) {inputProps.readOnly = "readonly";}
  if (props.required) {inputProps.required = props.required}
  if (props.accept) {inputProps.accept = props.accept}
  if (props.camera) {inputProps.capture = true}
  if (props.disabled === false) {
    inputProps.onChange = (e) => {
      handleChange(e)
      handleUpload(e)
    }
  }

  return (
  <div className={classProps.join(' ')} >
    <label className="upload__label" htmlFor={props.id ? props.id : props.name} style={inputProps.disabled ? {pointerEvents: 'none'} : {pointerEvents: 'auto'}}>
      <FontAwesomeIcon icon={(file && isLoaded && !error)? faCheck : props.camera ? faCamera : faUpload} className="upload__icon" /> 
      {title}
    </label>
    <input 
      {...inputProps}
      />

    {!props.disablePreview && file && src && <ImageContext
      id={images[0].id}
      alt={images[0].alt}
      src={images[0].src}
      images={images}
      disabled={false}
      type="gallery"
      helpText={props.helperText || "Image Preview"}
    />}

      <input 
        type="hidden" 
        name="props.name" 
        value={file? file.attachmentId : ''} 
      />

    {(error && !props.hideError) ? <p className="input__error"><FontAwesomeIcon icon={faExclamationTriangle} className="input__icon" /> {error.message}</p> : "" }
  </div>
)};