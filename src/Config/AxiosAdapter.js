import xhrAdapter from 'axios/lib/adapters/xhr'
import { isAuthError } from './AxiosInterceptor'
import AuthService from "../Service/AuthService"

const JWT_REFRESH_CONFIG = {
	url: `${process.env.REACT_APP_AUTH_BASE_URL}/api/auth/token/refresh`,
	method: 'POST',
	params: {},
	headers: {},
	data: {}
}

export default (config) => {
	return new Promise((resolve, reject) => {
		xhrAdapter(config)
		.then(response => resolve(response))
		.catch(error => {
			if (isAuthError(error)) {
				// Assigning refresh token here
				JWT_REFRESH_CONFIG.params = { refreshToken: AuthService.getRefreshToken() }
				xhrAdapter(JWT_REFRESH_CONFIG)
				.then((response) => {
					const r = JSON.parse(response.data)
					if(!Object.prototype.hasOwnProperty.call(r, "token") || !Object.prototype.hasOwnProperty.call(r, "refreshToken")) {
						AuthService.resetAuth()
						reject(error)
					} else {
						AuthService.setToken(r.token)
						config.headers.Authorization = `Bearer ${r.token}`
						xhrAdapter(config)
						.then(response => resolve(response))
						.catch(error => reject(error))
					}
				})
				.catch(() => {
					AuthService.resetAuth()
					reject(error)
				})
			} else {
				reject(error)
			}
		})
	})
}