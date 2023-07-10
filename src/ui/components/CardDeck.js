import React from 'react';

export default function CardDeck(props) {

  let classProps = ['card__wrap'];
  if (props.className) {classProps.push(props.className)}

  return (
    <div className={classProps.join(' ')} >
      {props.children}
    </div>
  )
};