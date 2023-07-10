import * as actionType from "../ActionTypes"
import AuthService from "../../Service/AuthService";

const initialState = {
  userIsSet: AuthService.userIsSet()
}

let authReducers = (state = initialState, action) => {
  switch (action.type) {
    case actionType.USER_IS_SET:
      return {
        ...state,
        userIsSet: action.userIsSet
      }

    default:
      return state
  }
}

export default authReducers
