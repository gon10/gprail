import React, { Component } from "react"
import "regenerator-runtime/runtime"

import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import {createUserService} from "../../Service/Factory"
import store from "../../Store"
import ApiErrorDataDialog from "../Alerts/ApiErrorDataDialog"
import {userIsSet} from "../../Store/Actions/Auth";

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = { switchState: false, user: false }
    this.userService = createUserService()
  }

  onSwitchChange = (value) => {
    this.setState({
      switchState: value
    })
  }

  getSwitchState = () => {
    return this.state.switchState
  }

  callBackend = (e) => {
    e.preventDefault()
    this.userService.getCurrentUser().then( response => {
      this.setState({
        user: response.data
      })
    }).catch(error => {
      console.error(error.response)
      store.dispatch(userIsSet(false))
      this.setState({
        user: null
      })
      ApiErrorDataDialog(error.response.data.message).then(result => {
      })
    })
  }

  callAdminBackend = (e) => {
    e.preventDefault()
    this.userService.getAdminCurrentUser().then( response => {
      this.setState({
        user: response.data
      })
    }).catch(error => {
      console.error(error.response)
      store.dispatch(userIsSet(false))
      this.setState({
        user: null
      })
      ApiErrorDataDialog(error.response.data.message).then(result => {
      })
    })
  }

  callAdminSkeletonBackend = (e) => {
    e.preventDefault()
    this.userService.getAdminSkeletonCurrentUser().then( response => {
      this.setState({
        user: response.data
      })
    }).catch(error => {
      console.error(error.response)
      store.dispatch(userIsSet(false))
      this.setState({
        user: null
      })
      ApiErrorDataDialog(error.response.data.message).then(result => {
      })
    })
  }

  render() {
    const protectedContent = store.getState().auth.userIsSet
        ? <div style={{marginBottom: "2rem"}}><h2>Some protected content initial commit</h2></div>
        : null

    return (
      <div className="body home has-no-padding has-text-centered">
        <p style={{marginBottom: "2rem"}}>Home</p>
        {protectedContent}
        <p><a style={{marginTop: "4rem"}} href={"#!"} onClick={e => this.callBackend(e)}>call auth backend</a></p>
        <p><a style={{marginTop: "4rem"}} href={"#!"} onClick={e => this.callAdminBackend(e)}>call admin backend</a></p>
        <p><a style={{marginTop: "4rem"}} href={"#!"} onClick={e => this.callAdminSkeletonBackend(e)}>call admin skeleton test</a></p>
        <pre style={{marginTop: "2rem"}}>{this.state.user ? JSON.stringify(this.state.user) : ''}</pre>
      </div>
    )
  }
}

export default Home
