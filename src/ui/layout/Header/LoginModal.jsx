import React, { useState } from "react"
import { faSignInAlt, faIdCard } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Modal from "../../components/Modal"
import Button from '../../base/Button'
import Input from '../../base/Input'
import { createAuthService, createUserService } from "../../../Service/Factory"
import store from "../../../Store"
import { pageIsLoading } from "../../../Store/Actions/Page"
import { userIsSet } from "../../../Store/Actions/Auth"
import SignInSuccessDialog from "../../Alerts/SignInSuccessDialog"
import ApiErrorDataDialog from "../../Alerts/ApiErrorDataDialog"

export default function LoginModal(props) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const authService = createAuthService()
  const userService = createUserService()

  function signIn() {
    store.dispatch(pageIsLoading(true))
    let data = {
      email: username,
      password: password
    }

    authService.signIn(data).then(response => {
      authService.persistAuth(response.data)
      // auth data not persisted at the time of next call
      let config = {
        headers: {
          Authorization: `Bearer ${response.data.token}`
        }
      }

      userService.getCurrentUser(config).then(response => {
        store.dispatch(userIsSet(true))
        authService.setUser(response.data)
        props.setShowModal(false)
        store.dispatch(pageIsLoading(false))
        SignInSuccessDialog().then()
      }).catch(error => {
        console.error(error.response)
        console.log(data)
        ApiErrorDataDialog(error.response).then(result => {
          store.dispatch(pageIsLoading(false))
        })
      })
    }).catch(error => {
      console.error(error.response)
      ApiErrorDataDialog(error.response.data.message).then(result => {
        store.dispatch(pageIsLoading(false))
      })
    })
  }

  function signInCognito() {
    store.dispatch(pageIsLoading(true))
    window.location.href = process.env.REACT_APP_COGNITO_URI + process.env.REACT_APP_COGNITO_RETURN_URI
  }

  return (
    <Modal showModal={props.showModal}
      setShowModal={props.setShowModal}
      title="Sign In"
      footer={<Button action="primary" onClick={() => { signIn() }}><FontAwesomeIcon icon={faSignInAlt} /> Sign in</Button>}
    >
      <Input name="Email" onChange={e => setUserName(e.target.value)} value={username} required />
      <Input name="Password" type="password" onChange={e => setPassword(e.target.value)} value={password} required />

      <Button action="secondary" fullwidth onClick={() => { signInCognito() }}><FontAwesomeIcon icon={faIdCard} /> Continue with Cognito</Button>
    </Modal>
  );
}