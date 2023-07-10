import React, { Component }  from "react"
import PropTypes from "prop-types"
import {faSpinner} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class PageLoader extends Component {
  static propTypes = {
    isActive: PropTypes.bool.isRequired
  }

  render() {
    if (this.props.isActive) {
      return (
        <div className="spinner-wrapper" >
          <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
        </div>
      )
    } else {
      return null
    }
  }

}

export default (PageLoader)