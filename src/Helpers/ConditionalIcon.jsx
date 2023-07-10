import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

const ConditionalIcon = props => {
  let { visible, icon } = props

  if (visible) {
    return <FontAwesomeIcon icon={icon} />
  }
  return null
}

export default ConditionalIcon