import React from 'react';

export default function Button(props) {

  let classProps = ['button'];
  if (props.action) {classProps.push('button--'+props.action)}
  if (props.rounded) {classProps.push('button--rounded')}
  if (props.fullwidth) {classProps.push('button--fullwidth')}
  if (props.disabled) {classProps.push('button--disabled')}
  if (props.className) {classProps.push(props.className)}

  let buttonProps = {
    onClick: props.onClick,
    disabled: props.disabled,
    name: props.name,
    type: props.type,
    value: props.value,
    title: props.title,
  }

  return (
    <button className={classProps.join(' ')} {...buttonProps} >
      <span className="button__text">{props.label}</span> {props.children}
    </button>
  )
};
