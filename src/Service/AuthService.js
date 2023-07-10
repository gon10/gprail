import axios from "axios"
import CryptoService from './CryptoService'
import AxiosInterceptor from "../Config/AxiosInterceptor"

const baseUrl = `${process.env.REACT_APP_AUTH_BASE_URL}/api/auth`

export default class AuthService {

  static signIn(data) {
    return new Promise((resolve, reject) => {
      axios.post(`${baseUrl}/login_check`, data).then((response) => {
        resolve(response)
      }).catch(error => reject(error))
    })
  }

  static requestPasswordReset(data) {
    return new Promise((resolve, reject) => {
      axios.post(`${baseUrl}/password/reset`, data).then((response) => {
        resolve(response)
      }).catch(error => reject(error))
    })
  }

  static resetPassword(data) {
    return new Promise((resolve, reject) => {
      axios.patch(`${baseUrl}/password/reset`, data).then((response) => {
        resolve(response)
      }).catch(error => reject(error))
    })
  }

  static activateUser(data) {
    return new Promise((resolve, reject) => {
      axios.post(`${baseUrl}/user/activate`, data).then((response) => {
        resolve(response)
      }).catch(error => reject(error))
    })
  }

  static checkSecureLink(data) {
    return new Promise((resolve, reject) => {
      axios.post(`${baseUrl}/check/securelink`, data).then((response) => {
        resolve(response)
      }).catch(error => reject(error))
    })
  }

  static signOut() {
    return new Promise((resolve) => {
      this.resetAuth()
      AxiosInterceptor()
      resolve(true)
    })
  }

  static persistAuth(data) {
    this.setToken(data.token)
    this.setRefreshToken(data.refreshToken)
  }

  static resetAuth() {
    localStorage.clear()
  }

  static getToken(s) {/*console.log(s, localStorage.getItem('token'))*/
    return localStorage.getItem('token')
  }

  static setToken(token) {
    return localStorage.setItem('token', token)
  }

  static getRefreshToken() {
    return localStorage.getItem('refreshToken')
  }

  static setRefreshToken(token) {
    return localStorage.setItem('refreshToken', token)
  }

  static getUser() {
    return this.userIsSet() ? CryptoService.decrypt(localStorage.getItem('user')) : null
  }

  static userIsSet() {
    return !!localStorage.getItem('user')
  }

  static getUserRoles() {
    if (!this.getUser()) {
      return []
    }
    return this.getUser().roles
  }

  static setUser(user) {
    return localStorage.setItem('user', CryptoService.encrypt(user))
  }

  static getUserId() {
    if (!localStorage.getItem('user')) {
      return null
    }
    return this.getUser().id
  }

  static getLoggedInTime() {
    let user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      return
    }

    return user.lastLoginDate
  }
}
