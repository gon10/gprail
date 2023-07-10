import * as actionType from "./../ActionTypes"

export const pageIsLoading = status => {
  return {
    type: actionType.PAGE_IS_LOADING,
    pageLoader: status,
  }
}
