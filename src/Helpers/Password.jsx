import React, { Component } from 'react'
import {faEye, faEyeSlash, faKey} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import ConditionalIcon from "./ConditionalIcon"
import variations from "./Password/PasswordVariations"
import PropTypes from "prop-types"
import Memo from "../Components/Pages/Home/Memo"

export default class Password extends Component {
  constructor(props) {
    super(props)

    this.state = {
      password: {
        password: '',
        passwordConfirm: '',
        score: 0,
        minScore: 45,
        warnings: [],
        suggestions: []
      },
      revealPassword: false,
      progressClass: '',
      progressLabel: '',
      progressValue: 0,
      inputType: 'password',
      placeholder: Object.prototype.hasOwnProperty.call(this.props.options, "placeholder") ? this.props.options.placeholder : '******'
    }
  }

  scorePassword = () => {
    if (this.state.password.password.length > 0) {
      let score = 0
      let letters = {}
      let variationCount = 0

      for (let i=0; i < this.state.password.password.length; i++) {
        letters[this.state.password.password[i]] = (letters[this.state.password.password[i]] || 0) + 1
        score += 5.0 / letters[this.state.password.password[i]];
      }

      for (let check in variations.suggestions) {
        if (variations.suggestions[check].test.test(this.state.password.password)) {
          variationCount += 1

          this.removeFromWarnings(variations.suggestions[check].warning)
          this.removeFromSuggestions(variations.suggestions[check].suggestion)
        } else {
          this.pushToWarnings(variations.suggestions[check].warning)
          this.pushToSuggestions(variations.suggestions[check].suggestion)
        }
      }

      score += (variationCount - 1) * 7

      let { password } = { ...this.state }
      let currentState = password
      currentState.score = parseInt(score)

      this.setState({ password: currentState })
    } else {
      this.clearPassword()
    }
  }

  pushToWarnings = (w) => {
    let password = {...this.state.password}

    if (!password.warnings.includes(w) && w.length > 0) {
      password.warnings.push(w)
    }
    this.setState({password})
  }

  removeFromWarnings = (w) => {
    let password = {...this.state.password}
    let i = password.warnings.indexOf(w)
    if (i > -1) {
      password.warnings.splice(i, 1)
    }
    this.setState({password})
  }

  pushToSuggestions = (s) => {
    let password = {...this.state.password}
    if (!password.suggestions.includes(s) && s.length > 0) {
      password.suggestions.push(s)
    }
    this.setState({password})
  }

  removeFromSuggestions = (s) => {
    let password = {...this.state.password}
    let i = password.suggestions.indexOf(s)
    if (i > -1) {
      password.suggestions.splice(i, 1)
    }
    this.setState({password})
  }

  clearPassword = () => {
    let password = {...this.state.password}
    password.score = 0
    password.suggestions = []
    password.warnings = []
    this.setState({password})
  }

  size = () => {
    return Object.prototype.hasOwnProperty.call(this.options, "size")
    && variations.sizes.indexOf(this.options.size) !== -1 ? `is-${this.options.size}` : 'is-medium'
  }

  showProgress = () => {
    return Object.prototype.hasOwnProperty.call(this.options, "showProgress") ? this.options.showProgress : true
  }

  placeholder = () => {
    return Object.prototype.hasOwnProperty.call(this.options, "placeholder") ? this.options.placeholder : '******'
  }

  passwordScoreLabel = () => {
    return this.state.password.score < 100 ? this.state.password.score : 100
  }

  updatePassword = (e) => {
    let { password } = { ...this.state }
    let currentState = password
    currentState.password = e.target.value
    this.setState({ password: currentState })

    this.scorePassword()
    if (this.state.password.password.length > 0) {
      this.checkLength()
      this.checkMinScore()
      this.updateProgress()
      this.props.getVal(true)
    }
  }

  toggleRevealPassword = () => {
    let showPassword = !this.state.revealPassword
    this.setState({
      revealPassword: showPassword,
      inputType: showPassword ? 'text' : 'password'
    })
  }

  updateProgress = () => {
    let progressLabel = ""
    let progressClass = ""
    if (this.state.password.score >= 80) {
      progressLabel = "very strong"
      progressClass = "is-success"
    } else if (this.state.password.score >= 60) {
      progressLabel = "strong"
      progressClass = "is-success"
    } else if (this.state.password.score >= 45) {
      progressLabel = "good"
      progressClass = "is-info"
    } else if (this.state.password.score >= 30) {
      progressLabel = "fair"
      progressClass = "is-warning"
    } else {
      progressLabel = "weak"
      progressClass = "is-danger"
    }
    this.setState({
      progressLabel,
      progressClass
    })
  }

  checkLength = () => {
    let warning = 'Please increase the length of your password'
    if (this.state.password.password.length < 6) {
      this.pushToWarnings(warning)
    } else if (this.state.password.password.length >= 6) {
      this.removeFromWarnings(warning)
    }
  }

  checkMinScore = () => {
    let msg = 'Please increase the password strength to a minimum score of '+this.state.password.minScore
    if (this.state.password.score < this.state.password.minScore) {
      this.pushToWarnings(msg)
    } else if (this.state.password.score >= this.state.password.minScore) {
      this.removeFromWarnings(msg)
    }
  }

  render() {
    return (
      <div className="password">
        {this.state.password.suggestions.length > 0 && this.state.password.suggestions.map(
          (suggestions, i) => <p key={i} className={"feedback is-info"}>{i+1}. {suggestions}</p>)
        }
        {this.state.password.warnings.length > 0 && this.state.password.warnings.map(
          (warning, i) => <p key={i} className={"feedback is-danger"}>{i+1}. {warning}</p>)
        }
        <div className="control has-icons-left has-icons-right">

          <input className="input is-medium" type={this.state.inputType}
            placeholder={this.state.placeholder}
            onInput={this.updatePassword}
          />

          <span className="icon is-small is-left">
            <FontAwesomeIcon icon={faKey} />
          </span>
          <span className="icon is-right password-reveal" onClick={() => {this.toggleRevealPassword()}}>
            <ConditionalIcon visible={true} icon={this.state.revealPassword ? faEye : faEyeSlash} />
          </span>
        </div>

        <div className="progress-wrapper">
          <progress className={"progress is-small " + this.state.progressClass}
            value={this.state.password.score} max="100"
          >{ this.state.password.score }</progress>
          <label className={"icon is-right progress-label " + this.state.progressClass}>
            <small>({ this.passwordScoreLabel() })</small> { this.state.progressLabel }
          </label>
        </div>
      </div>
    )
  }
}

Memo.propTypes = {
  value: PropTypes.string.isRequired
}