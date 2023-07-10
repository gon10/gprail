import React from 'react';
import { Link } from "react-router-dom";

export default function Card(props) {

  let classProps = ['card'];
  if (props.rounded) {classProps.push('card--rounded')}
  if (props.noHeader) {classProps.push('card--no-header')}
  if (props.disabled) {classProps.push('card--disabled')}
  if (props.link) {classProps.push('card__link')}
  if (props.className) {classProps.push(props.className)}

  const title = props.title? props.title : "Default Card Title";
  const subTitle = props.subTitle? props.subTitle : "Default Card Subtitle"; 
  const content = props.content? props.content : <p>Default card content as a paragraph</p>
  const link = props.link? props.link : undefined;

  let width = props.width? props.width : "100";
  classProps.push('card--width'+width);

  const cardContent = <> {props.noHeader? null :
    <div className="card__head">
      <h2 className="card__title">{title}</h2>
      <h3 className="card__subtitle">{subTitle}</h3>
    </div>}
    <div className="card__body">
      {content}
      {props.children}
    </div>
    {props.noFooter? null : 
    <div className="card__foot">
      {props.footer}
    </div>} </>

  return (
    <>
      {link? <Link className={classProps.join(' ')}  to={link}>
        {cardContent}
      </Link> : 
      <div className={classProps.join(' ')} >
        {cardContent}
      </div>}
    </>
  )
};