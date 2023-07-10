import { createStore } from "redux"

const applicationConfig = {
  CRYPTO_KEY: process.env.REACT_APP_CRYPTO_KEY_SECRET
}

const applicationConfigReducer = (state = applicationConfig, action) => state
const applicationConfigStore = createStore(applicationConfigReducer)

export { applicationConfigReducer, applicationConfigStore, applicationConfig }
