import React from 'react';
import { Link } from "react-router-dom"
import { faSignInAlt, faUserPlus, faDoorOpen, faIdBadge } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from '../base/Button'

export default function LoginPage(props) {
  return (
    <div className="login-page">
      <div className="login-page__welcome">
        <h1 className="login-page__welcome__title">RailHub by OnTrac</h1>
        <p className="login-page__welcome__p">RailHub is a digital platform that allows users to plan and deliver safe work on the railways. 
          With unique capabilities, including: schematics on demand, live work site monitoring and digital 
          sign offs, work being carried out on or near the line is done so safely and productively.</p>

        <p className="login-page__welcome__p">RailHub is maintained to the very latest compliance standards and is available across desktop, 
        smartphone and tablet devices.</p>

        <p className="login-page__welcome__p">Please sign in or register.</p>
      </div>
      <div className="login-page__card">
        <h2 className="login-page__card__title">Sign In</h2>
        <FontAwesomeIcon className="login-page__card__icon" icon={faDoorOpen} />
        <p className="login-page__card__p">Sign in to your RailHub acount to access RailApps, features, and your RailHub Dashboard.</p>

        <Button action="primary" fullwidth onClick={() => {props.setShowModal(true)}}>
          <FontAwesomeIcon icon={faSignInAlt} /> <span>Sign in</span>
        </Button>
      </div>
      <div className="login-page__card">
        <h2 className="login-page__card__title">Register</h2>
        <FontAwesomeIcon className="login-page__card__icon" icon={faIdBadge} />
        <p className="login-page__card__p">Register today to start using RailHub applications and services.</p>
        <Link to="/register">
          <Button action="primary" fullwidth>
            <FontAwesomeIcon icon={faUserPlus} /> <span>Register</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}