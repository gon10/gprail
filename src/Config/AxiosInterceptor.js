import axios from 'axios'
import AuthService from "../Service/AuthService"
import AxiosAdapter from "./AxiosAdapter"

const HTTP_UNAUTHORIZED = 401
const LOGIN_API_URL = '/auth/login_check'
//const LOGIN_URL = '/login'

export const isAuthError = (error) => {
	if (!axios.isCancel(error)) {
		return (
			( HTTP_UNAUTHORIZED === error.request.status && LOGIN_API_URL !== error.response.config.url ) ||
			( error.response && HTTP_UNAUTHORIZED === error.response.status && LOGIN_API_URL !== error.response.config.url )
		)
	}
	return false
}

export default () => {
	axios.defaults.adapter = AxiosAdapter

	if (null !== AuthService.getToken()) {
		axios.defaults.headers.common.Authorization = `Bearer ${AuthService.getToken()}`
	}

	axios.interceptors.response.use(
		response => {
			let token = response.headers.authorization

			if (token && token.length > 0 ) {
				AuthService.setToken(token)
			}
			if (null !== AuthService.getToken()) {
				axios.defaults.headers.common.Authorization = `Bearer ${AuthService.getToken()}`
			}
			return Promise.resolve(response)
		},
		error => {
			console.error(error)
			// if (LOGIN_URL !== router.currentRoute.path) { // Preventing page reload on bad login credentials
			// 	console.log(LOGIN_URL, router.currentRoute.path)
			// 	Notification.toast('error', 'Session expired. Redirecting to login page')
			// } else {
			// 	Notification.toast('error', error)
			// }
			return Promise.reject(error)
		}
	)
}