import React from "react"
import { Link } from "react-router-dom"
import Navigation from "./Header/Navigation"

export default function Header(props) {

  return (
    <div className="header">
      <Link to="/" className="header__identity">
        <div className="header__logo__wrap">
          <svg className="header__logo" x="0px" y="0px"
            viewBox="0 0 400 400" >
            <path d="M243.1,295.3c-4.1,0-7.9-2.2-9.9-5.7l-48.7-83.9c-2.1-3.5-2.1-7.9,0-11.4l48.3-84.1c2-3.5,5.8-5.7,9.9-5.7l97-0.2
  c0,0,0,0,0,0c4.1,0,7.9,2.2,9.9,5.7l48.7,83.9c2.1,3.5,2.1,7.9,0,11.4l-48.3,84.1c-2,3.5-5.8,5.7-9.9,5.7L243.1,295.3
  C243.2,295.3,243.2,295.3,243.1,295.3z M207.7,199.9l42.1,72.5l83.8-0.2l41.8-72.7L333.2,127l-83.8,0.2L207.7,199.9z"/>
            <path d="M60.2,191c-4.1,0-7.9-2.2-9.9-5.7L1.6,101.4c-2.1-3.5-2.1-7.9,0-11.4L49.9,5.8c2-3.5,5.8-5.7,9.9-5.7l97-0.2c0,0,0,0,0,0
  c4.1,0,7.9,2.2,9.9,5.7l48.7,83.9c2.1,3.5,2.1,7.9,0,11.4l-48.3,84.1c-2,3.5-5.8,5.7-9.9,5.7L60.2,191
  C60.2,191,60.2,191,60.2,191z M24.7,95.6l42.1,72.5l83.8-0.2l41.8-72.7l-42.1-72.5l-83.8,0.2L24.7,95.6z"/>
            <path d="M60.2,400.2c-4.1,0-7.9-2.2-9.9-5.7L1.6,310.5c-2.1-3.5-2.1-7.9,0-11.4l48.3-84.1c2-3.5,5.8-5.7,9.9-5.7l97-0.2
  c0,0,0,0,0,0c4.1,0,7.9,2.2,9.9,5.7l48.7,83.9c2.1,3.5,2.1,7.9,0,11.4l-48.3,84.1c-2,3.5-5.8,5.7-9.9,5.7L60.2,400.2
  C60.2,400.2,60.2,400.2,60.2,400.2z M24.7,304.7l42.1,72.5l83.8-0.2l41.8-72.7l-42.1-72.5l-83.8,0.2L24.7,304.7z"/>
          </svg>
        </div>
        <div className="header__text">
          <h1 className="header__title">RailHub</h1>
          <p className="header__sub-title">All your apps, one place</p>
        </div>
      </Link>
      <Navigation showModal={props.showModal} setShowModal={props.setShowModal} />
    </div>
  );
}