import React, { useEffect, useMemo, useState } from 'react'
import { faMobileAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, /*useLocation,*/ Route, Routes, useNavigate } from "react-router-dom"
import Records from './Records'
import RecordsAsGallery from './RecordsAsGallery'
import SingleRecord from './SingleRecord'
import SplitScreen from './SplitScreen'
import FourZeroFourPage from '../FourZeroFourPage'
import InfoBox from '../../base/InfoBox'
import Modal from '../../components/Modal'
import { Button } from '../../base'

export default function AppContainer(props) {
  const appId = props.appConfig.id? props.appConfig.id : localStorage.getItem('appId')? localStorage.getItem('appId') : "";
  const appName = props.appConfig.name? props.appConfig.name : localStorage.getItem('appName')? localStorage.getItem('appName') : "Untitled App";
  const appIcon = props.appConfig.icon? props.appConfig.icon : <FontAwesomeIcon icon={faMobileAlt} />;
  const appDescription = props.appConfig.description? props.appConfig.description : localStorage.getItem('appDescription')? localStorage.getItem('appDescription') : "No description provided.";
  const appLaunchPage = props.appConfig.config.launchDisplay? props.appConfig.config.launchDisplay : "RECORDS";
  
  const appUserRoles = useMemo(() => props.appUserRoles.length ? props.appUserRoles : JSON.parse(localStorage.getItem('appUserRoles') || '[]'), [props.appUserRoles]);
  const config = useMemo(() => Object.keys(props.appConfig.config).length ? props.appConfig.config : localStorage.getItem('config') ? JSON.parse(localStorage.getItem('config')) : "", [props.appConfig.config]);
  
  const appPages = config.pages? config.pages : ["RECORDS","SINGLE RECORD"];
  const appNavigation = config.navigation? config.navigation : appPages;
  const appRoles = config.allCapabilities? config.allCapabilities : [];
  
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  //console.log(config)
  //const location = useLocation()
  const [id] = useState({id: ""});
  //console.log(appRoles);
  localStorage.setItem('appId', appId);
  localStorage.setItem('appName', appName);
  localStorage.setItem('appDescription', appDescription);
  localStorage.setItem('config', JSON.stringify(config));
  localStorage.setItem('appUserRoles', JSON.stringify(appUserRoles))

  document.title = "RailHub Evo - "+appName || "RailHub Evo";

  if (!appRoles.includes("CREATE") ) { 
    const index = appPages.indexOf("SINGLE RECORD");
    if (index > -1) { 
      appPages.splice(index, 1); 
    }
  }

  const onCloseModal = () => {
    navigate('/', { replace: true })
    setShowModal(false)
  }

  useEffect(() => {
    const everyUserRoleExists = appUserRoles.every((roleName) => config.appRoles.find(role => role.roleName === roleName))
    
    if (!everyUserRoleExists) {
      setShowModal(false)
    }
  }, [config.appRoles, appUserRoles])

  const allPages = {
    "RECORDS": {
      pageName: "Records",
      pageRoute: "records",
      pageComponent: <Records config={config} />
    },
    "RECORD CRUD": {
      pageName: "Edit Record",
      pageRoute: "view-record/*",
      pageComponent: <SingleRecord config={config} defaultView="edit" />
    },
    "SINGLE RECORD": {
      pageName: "Add Record",
      pageRoute: "view-record/create/*",
      pageComponent: <SingleRecord config={config} defaultView="view" />
    },
    "SPLIT SCREEN": {
      pageName: "Split Screen",
      pageRoute: "splitscreen/*",
      pageComponent: <SplitScreen 
        left={<SingleRecord config={config} defaultView="edit" cols={1} viewType="splitscreen" id={id.id} />}
        right={<RecordsAsGallery config={config} viewType="splitscreen" id={id.id} />}
        config={config} 
        defaultView="view" />
    },
    "NOT FOUND": {
      pageName: "Not Found",
      pageRoute: "*",
      pageComponent: <FourZeroFourPage />
    },
  };

  const appNav = [];
  const appRoutes =[<Route key="appHome" path="/" element={allPages[appLaunchPage].pageComponent} />];
  //console.log(appRoutes);
  //console.log(appPages)
  appNavigation.forEach((page, i) => {
    appNav.push(
      <li className="app__nav__li" key={"appNav"+i}>
        <Link to={allPages[page].pageRoute} className="app__nav__button" state={{id:undefined}}>
          {allPages[page].pageName}
        </Link>
      </li>
    );
  });
  appPages.forEach((page, i) => {
    appRoutes.push(
      <Route key={"appRoute"+i} path={allPages[page].pageRoute} element={allPages[page].pageComponent} />
    );
  });
  appRoutes.push(
    <Route key="recordcrud" path={allPages["RECORD CRUD"].pageRoute} element={allPages["RECORD CRUD"].pageComponent} />
  );
  appRoutes.push(
    <Route key="app404" path={allPages["NOT FOUND"].pageRoute} element={allPages["NOT FOUND"].pageComponent} />
  );

  if (showModal) {
    return <Modal
      showModal={showModal}
      setShowModal={onCloseModal}
      title="Access Denied"
      footer={
        <Button action="primary" onClick={onCloseModal}>
          Ok
        </Button>
      }
    >
      You don't have the right access to view this app. Please contact <a href="mailto:enquiries@on-trac.co.uk">enquiries@on-trac.co.uk</a> for support.
    </Modal>
  }


  return (
    <div className="app">
      <div className="app__header">
        <Link to="/app/" className="app__identity">
          <div className="app__icon">
            {appIcon}
          </div>
          <div className="app__title__wrap">
            <h2 className="app__title">{appName}</h2>
          </div>
        </Link>
        <div className="app__nav__wrap">
          <ul className="app__nav">
            {appNav}
          </ul>
        </div>
      </div>
      <div className="app__body">
        <div className="info">
          <InfoBox type="info" fullWidth>{appDescription}</InfoBox>
        </div>
        <Routes>
          {appRoutes}
        </Routes>
      </div>
    </div>
  );
}