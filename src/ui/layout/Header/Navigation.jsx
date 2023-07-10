import React, { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { faHome, faBars, faSignOutAlt, faSignInAlt, faUserCog, faUserPlus, faAt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {createAuthService} from "../../../Service/Factory"
import store from "../../../Store/index"
import {pageIsLoading} from "../../../Store/Actions/Page"
import SignOutSuccessDialog from "../../Alerts/SignOutSuccessDialog"
import {userIsSet} from "../../../Store/Actions/Auth"
import OutsideClick from '../../../Helpers/OutsideClick'

function Navigation(props) {
  const ref = useRef()
  const [showDropdown, setShowDropdown] = useState(false)
  OutsideClick(ref, () => setShowDropdown(false))

  const navigate = useNavigate()

  const authService = createAuthService()
  let user = authService.getUser()
  const updateUser = () => {
    user = authService.getUser()
  }

  const signOut = () => {
    store.dispatch(pageIsLoading(true))
    authService.signOut().then( response => {
      setShowDropdown(true)
      store.dispatch(userIsSet(false))
      //store.dispatch(pageIsLoading(false))
      SignOutSuccessDialog().then(navigate("/")).then(navigate(0))
    })
  }

  const getUserNames = (initials) => {
    updateUser() // userIsSet state is updated before localStorage
    if (user) {
      if (initials) {
        return user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase()
      }
      return `${user.firstName} ${user.lastName}`
    }
    return null
  }

  const getUserEmail = () => {
    if (user) {
      return user.email
    }
    return null
  }

  const menuIcon = store.getState().auth.userIsSet
        ? <div className="nav__user__icon">{getUserNames(true)}</div>
        : <FontAwesomeIcon icon={faBars} className="nav__user__icon" />

  const menuHeader = store.getState().auth.userIsSet
        ? <div className="nav__user__header">
            <p className="nav__user__details">{getUserNames()}<br /> 
            <small className="nav__user__email">{getUserEmail()}</small></p>

            <hr className="nav__user__divider" />

            <Link to="/account" className="nav__user__menu-item" onClick={() => setShowDropdown(true)}>
              <FontAwesomeIcon icon={faUserCog} /> <span>Settings</span>
            </Link>
          </div>
        : <div className="nav__user__header">
            <a href="#!" className="nav__user__menu-item" onMouseDown={() => {props.setShowModal(true)}}>
              <FontAwesomeIcon icon={faSignInAlt} /> <span>Sign in</span>
            </a>
            <Link to="/register" className="nav__user__menu-item">
              <FontAwesomeIcon icon={faUserPlus} /> <span>Register</span>
            </Link>
          </div>

  const menuLogout = store.getState().auth.userIsSet
        ? <div className="nav__user__footer">
            <hr className="nav__user__divider" />
            <a href="#!" className="nav__user__menu-item" onMouseDown={() => {signOut()}}>
              <FontAwesomeIcon icon={faSignOutAlt} /> <span>Sign out</span>
            </a>
          </div>
        : null

  const mainMenu = store.getState().auth.userIsSet
    ? <li className="nav__li">
        <Link to="/" className="nav__button">
          <FontAwesomeIcon icon={faHome} className="nav__icon" /> <span className="nav__title">My Apps</span>
        </Link>
      </li>
    : <li className="nav__li">
        <a href="#!" className="nav__button" onMouseDown={() => {props.setShowModal(true)}}>
          <FontAwesomeIcon icon={faSignInAlt} /> <span>Sign in</span>
        </a>
      </li>

  return (
    <nav role="navigation" aria-label="main navigation" className="nav">
      <ul className="nav__ul">
        {mainMenu}
      </ul>

      <div className="nav__user__wrap" ref={ref}>
          <div className="nav__user">
            <button className="nav__user__menutoggle" onClick={() => setShowDropdown(!showDropdown)}>
              {menuIcon}
            </button>
            <div className={"nav__user__menu " + (showDropdown ? "nav__user__menu--open" : "")} >

              {menuHeader}

              <a href="mailto:enquiries@on-trac.co.uk" className="nav__user__menu-item">
                <FontAwesomeIcon icon={faAt} /> <span>Help</span>
              </a>

              {menuLogout}

            </div>
          </div>
      </div>
  </nav>
  )
}

export default Navigation