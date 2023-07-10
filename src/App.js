import React, { useState, Suspense, lazy, createContext }  from "react"
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom"
import store from "./Store"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import Footer from "./ui/layout/Footer"
import Header from "./ui/layout/Header"
import PageLoader from "./ui/components/PageLoader"
import { setHasCreatedDatabase } from "./Store/Actions"
import LoginPage from './ui/pages/LoginPage'
import LoginModal from './ui/layout/Header/LoginModal'
import RegisterPage from './ui/pages/RegisterPage'
import FourZeroFourPage from './ui/pages/FourZeroFourPage'
import { useRef } from "react"

const Home = lazy(() => import('./ui/pages/MyApps'))
const About = lazy(() => import('./ui/pages/About'))
const AppContainer = lazy(() => import('./ui/pages/app/AppContainer'))
const UserSettingsPage = lazy(() => import('./ui/pages/UserSettingsPage'))
const FormBuilder = lazy(() => import('./ui/pages/FormBuilder'))

const mapStateToProps = state => {
  return {
    hasDatabase: state.root.hasDatabase,
    pageLoader: state.page.pageLoader,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hasCreatedDatabase: status => dispatch(setHasCreatedDatabase(status)),
  }
}

export const UnitsContext = createContext({
  units: "milesYards",
  setUnits: () => {}
})

function App(props) {
  const [showModal, setShowModal] = useState(false);
  const [appUserRoles, setAppUserRoles] = useState([])
  const [appConfig, setAppConfig] = useState({
    id: "",
    name: "",
    description: "",
    icon: "",
    config: {}
  });

  const [units, setCurrentUnits] = useState('milesYards')
  const previousUnits = useRef(null);

  // Update the previous value whenever the current value changes
  const setUnits = (newValue) => {
    previousUnits.current = units;
    setCurrentUnits(newValue);
  };
  const unitsValue = { units,previousUnits, setUnits };
  //console.log(unitsValue)

  // function pageIsLoading() {
  //   return props.pageLoader ? '' : `<div className="spinner-wrapper" ><FontAwesomeIcon icon={faSpinner} className="fa-spin" /></div>`
  // }

  const renderCannotCreateDatabaseWarning = () => {
    const { hasDatabase } = props

    if (false === hasDatabase) {
      return <Navigate to="/error?message=storage" replace />
    }

    return ""
  }

  const pageContent = store.getState().auth.userIsSet
    ? <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home appConfig={appConfig} appUserRoles={appUserRoles} setAppConfig={setAppConfig} setAppUserRoles={setAppUserRoles} />} />
          <Route path="/about" element={<About />}/>
          <Route path="/account" element={<UserSettingsPage />}/>
          <Route path="/builder" element={<FormBuilder />}/>
          <Route path="/app/*" element={<AppContainer appConfig={appConfig} appUserRoles={appUserRoles} setAppConfig={setAppConfig} setAppUserRoles={setAppUserRoles} />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="*" element={<FourZeroFourPage />} />
        </Routes>
      </Suspense>
    : <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LoginPage showModal={showModal} setShowModal={setShowModal} />} />
          <Route path="/register" element={showModal ? <Navigate to="/" replace /> : <RegisterPage />} />
          <Route path="*" element={<FourZeroFourPage />} />
        </Routes>
      </Suspense>

  return (
    <div className="core">
      <UnitsContext.Provider value={unitsValue}>
        <LoginModal showModal={showModal} setShowModal={setShowModal} />
        <Router>
          <div className="wrap">
            <Header showModal={showModal} setShowModal={setShowModal} />
            <div className="main--single-full-width">
              {renderCannotCreateDatabaseWarning()}
              {pageContent}
            </div>
            <Footer />
          </div>
          <PageLoader isActive={props.pageLoader} />
        </Router>
      </UnitsContext.Provider>
    </div>
  );
}

App.propTypes = {
  pageLoader: PropTypes.bool.isRequired,
  hasCreatedDatabase: PropTypes.func.isRequired,
  hasDatabase: PropTypes.bool,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)