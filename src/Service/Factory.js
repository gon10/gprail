import AuthService from "./AuthService"
import UserService from "./UserService"

const createAuthService = () => {
  return AuthService
}

const createUserService = () => {
  return UserService
}

export {
  createAuthService,
  createUserService
}
