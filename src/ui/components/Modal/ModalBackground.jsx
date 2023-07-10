import React, {Component} from "react"

export default class ModalBackground extends Component {
  setVisible = (value) => {
    this.props.setVisible(value)
  }

  render() {
    return (
      this.props.showBackground
        ? <div className="modal-background" onClick={() => {this.setVisible(false)}}></div>
        : null
    )
  }
}