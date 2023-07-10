const initialState = {
  isConnected: navigator.onLine,
  isSyncing: false,
  hasDatabase: null,
  isInTrainingMode: false
}

let rootReducer = (state = initialState, action) => {
  switch (action.type) {
    default: {
      return state
    }
  }
}

export default rootReducer
