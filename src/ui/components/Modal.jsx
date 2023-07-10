import React from "react"
import Button from '../base/Button'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes"

export default function Modal(props) {
  const title = props.title? props.title : "Message";
  const body = props.children? props.children : "Please confirm.";
  const footer = props.footer? props.footer : "";

  let classProps = ['modal'];
  if (props.disabled) {classProps.push('modal--disabled')}
  if (props.className) {classProps.push(props.className)}
  if (props.error) {classProps.push('modal--warning')}
  if (props.success) {classProps.push('modal--success')}

  return (
    <div className={"modal__wrap " + (props.showModal ? "" : "modal__wrap--close")}>
      <div className={classProps.join(' ')}>
        <header className="modal__header">
          <h4 className="modal__title">{title}</h4>
          <Button action="tertiary" className="modal__close" aria-label="close" onClick={() => props.setShowModal(false)}><FontAwesomeIcon icon={faTimes} /></Button>
        </header>
        <section className="modal__body">
          {body}
        </section>
        <footer className="modal__footer">
          <Button action="tertiary" onClick={() => {if(props.onClose){props.onClose()};props.setShowModal(false)}}>
            <FontAwesomeIcon icon={faTimes} /> Close
          </Button>
          {footer}
        </footer>
      </div>
    </div>
  );
};