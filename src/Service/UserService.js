import axios from 'axios'

const basedUrl = `${process.env.REACT_APP_AUTH_BASE_URL}/api/auth/secured`

export default class UserService {

  static getCurrentUser(config) {
    return new Promise((resolve, reject) => {
      axios.get(`${basedUrl}/user`,config).then((response) => {
        resolve(response)
      }).catch(error => reject(error))
    })
  }

  static createUser(data) {
    return new Promise((resolve, reject) => {
      axios.post(`${basedUrl}/user`,data).then((response) => {
        resolve(response)
      }).catch(error => reject(error))
    })
  }

  static getUser(userId) {
    return new Promise((resolve, reject) => {
      axios.get(`${basedUrl}/user/${userId}`).then((response) => {
        resolve(response)
      }).catch(error => reject(error))
    })
  }

  static updateUserStatus(data) {
    return new Promise((resolve, reject) => {
      axios.put(`${basedUrl}/user/${data.id}`,
        data
      ).then((response) => {
        resolve(response)
      }).catch(error => reject(error))
    })
  }

  static updateUserEmail(data) {
    return new Promise((resolve, reject) => {
      axios.patch(`${basedUrl}/user/${data.id}`,
        data
      ).then((response) => {
        resolve(response)
      }).catch(error => reject(error))
    })
  }

  static updateCurrentUser(data) {
    return new Promise((resolve, reject) => {
      axios.patch(`${basedUrl}/user`,
        data
      ).then((response) => {
        resolve(response)
      }).catch(error => reject(error))
    })
  }

	static updateUser(data) {
		return new Promise((resolve, reject) => {
			axios.post(`${basedUrl}/user/${data.id}`,
				data
			).then((response) => {
				resolve(response)
			}).catch(error => reject(error))
		})
	}

  static checkEmailExist(data) {
    return new Promise((resolve, reject) => {
      axios.get(`${basedUrl}/user/email`, {
        params: data
      }).then((response) => {
        resolve(response)
      }).catch(error => reject(error))
    })
  }

  static deleteUser(data) {
    return new Promise((resolve, reject) => {
      axios.delete(`${basedUrl}/user/${data.id}`).then((response) => {
        resolve(response)
      }).catch(error => reject(error))
    })
  }
}
