import * as actionType from "./../ActionTypes"

export const userIsSet = status => {
  return {
    type: actionType.USER_IS_SET,
    userIsSet: status,
  }
}
