import * as actionType from "../ActionTypes"

const initialState = {
  pageLoader: false
}

let pageReducers = (state = initialState, action) => {
  switch (action.type) {
    case actionType.PAGE_IS_LOADING:
      return {
        ...state,
        pageLoader: action.pageLoader
      }

    default:
      return state
  }
}

export default pageReducers
