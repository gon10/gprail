import React from 'react';
import { useLocation } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "../base/Button"

export function Step(props) {
  library.add( fas )

  const link = props.link? props.link : "/";
  const icon = props.icon? props.icon : "spider";
  const iconShape = props.iconShape? "multi-step-bar__icon__wrap "+props.iconShape : "multi-step-bar__icon__wrap";
  const title = props.title? props.title : "Step title";
  const titleShape = props.titleShape? "multi-step-bar__title__wrap "+props.titleShape : "multi-step-bar__title__wrap";

  const location = useLocation()
  const thisFormPage = location.pathname.split("/").pop() === "edit"? "*" : location.pathname.split("/").pop()
  const onProgress = props.onProgress? props.onProgress : (e) => console.log(e);
  const data = props.data

  let classProps = ['multi-step-bar__step'];
  if (props.disabled) {classProps.push('multi-step-bar__step--disabled')}
  if (props.active || (thisFormPage === link)) {classProps.push('multi-step-bar__step--active')}
  if (props.className) {classProps.push(props.className)}

  return (
    <div className={classProps.join(' ')}>
      <Button action="tertiary" className="multi-step-bar__link" onClick={() => onProgress(data, link)}>
        <span className={iconShape}>
          <FontAwesomeIcon className="multi-step-bar__icon" icon={['fas', icon]} />
        </span>
        <span className={titleShape}>
          <span className="multi-step-bar__title">{title}</span>
        </span>
      </Button>
    </div>
  )
};

export default function MultiStepBar(props) {

  const iconShape = props.iconShape? props.iconShape : null;
  const steps = props.steps? props.steps : [];
  const onProgress = props.onProgress? props.onProgress : (e) => console.log(e);
  const data = props.data

  let classProps = ['multi-step-bar'];
  if (props.square) {classProps.push('multi-step-bar--square')}
  if (props.disabled) {classProps.push('multi-step-bar--disabled')}
  if (props.className) {classProps.push(props.className)}

  let content;
  if (Array.isArray(steps)) {
    content = steps.map( (step, i) => 
      <Step key={i} 
        link={step.link} 
        icon={step.icon}
        title={step.title} 
        iconShape={iconShape}
        disabled={step.disabled}
        active={step.active}
        onProgress={onProgress}
        data={data}
      /> 
    );
  } 

  return (
    <div className={classProps.join(' ')} >
        {content}
        {props.children}
    </div>
  )
};