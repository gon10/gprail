import React  from "react"
import ReactDOM from 'react-dom/client'

import './Assets/css/style.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from "react-redux"
import store from "./Store/index"

import AxiosInterceptor from "./Config/AxiosInterceptor"
AxiosInterceptor()

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    {/*<React.StrictMode>*/}{/* Text editor logging errors in strict mode */}
      <App />
    {/*</React.StrictMode>*/}
  </Provider>
);

reportWebVitals()
