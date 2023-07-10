import {createStore, combineReducers, applyMiddleware} from "redux"
import thunk from "redux-thunk"
import rootReducer from "./Reducers/index"
import pageReducer from "./Reducers/Page"
import middlewareChain from "./Middleware/MiddlewareChain"
import authReducer from "./Reducers/Auth"

const middleware = [thunk]

const store = createStore(
  combineReducers({
    root: rootReducer,
    page: pageReducer,
    auth: authReducer,
  }),
  applyMiddleware(...middleware)
)

store.dispatch(middlewareChain)

export default store
