import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {Link} from "react-router-dom"
/*import { faMobileAlt, faInfoCircle, faTimes, faExternalLinkAlt, faFrown, faStar, faThumbtack, faTools } from "@fortawesome/free-solid-svg-icons"*/

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from '../base/Button'
import SquaresShuffle from '../components/SquaresShuffle'

let DavidsTestAppConfig = require('../../Assets/json/davidsTestApp.json');
let GoncalosTestAppConfig = require('../../Assets/json/goncalosTestApp.json');
let GoransTestAppConfig = require('../../Assets/json/goransTestApp.json');
//console.log(testAppConfig)

library.add( fas )

function AppDescription(props) {
  return (
    <div className={props.showInfo? "app-dashboard__description__wrap app-dashboard__description__wrap--open" : "app-dashboard__description__wrap"}
      onClick={() => props.setShowInfo(false)}>
      <div className="app-dashboard__description">
        <div className="app-dashboard__description__header">
          <h2 className="app-dashboard__description__title">{props.name}</h2>
          <Button action="primary" className="app-dashboard__description__close" onClick={() => props.setShowInfo(false)}>
            <FontAwesomeIcon icon={['fas', 'times']} />
          </Button>
        </div>
        <div className="app-dashboard__description__body">
          <div className="app-dashboard__description__body__column">
            <span className="app-dashboard__app__icon">{props.icon}</span>
          </div>
          <div className="app-dashboard__description__body__column">
            <p className="app-dashboard__description__p">{props.description}</p>
            <p className="app-dashboard__description__p small"><b>App ID:</b> {props.id}</p>
            {props.status === "favourite"? <p><FontAwesomeIcon icon={['fas', 'star']} /> This app is in your favourites.</p> : ""}
            {props.status === "pinned"? <p><FontAwesomeIcon icon={['fas', 'thumbtack']} /> This app has been pinned to top.</p> : ""}
            {props.status === "updated"? <p><FontAwesomeIcon icon={['fas', 'tools']} /> This app has been updated.</p> : ""}
            <Link className="button button--primary button--fullwidth" to={props.link}
              onMouseDown={() => {
                props.setAppUserRoles(props.userRoles)
                props.setAppConfig({
                  id: props.id,
                  name: props.name,
                  description: props.description,
                  icon: props.icon,
                  config: props.config
                })
            }}
            >
              <FontAwesomeIcon icon={['fas', 'external-link-alt']} /> Launch App
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function App(props) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="app-dashboard__app__wrap">
      {props.description ? <Button action="primary" className="app-dashboard__app__info" onClick={() => setShowInfo(!showInfo)}>
        <FontAwesomeIcon icon={['fas', 'info-circle']} /></Button>: ""}
      {props.description ?
        <AppDescription
          showInfo={showInfo}
          setShowInfo={setShowInfo}
          id={props.id}
          name={props.name}
          description={props.description}
          icon={props.icon}
          link={props.link}
          status={props.status}
          setAppConfig={props.setAppConfig}
          config={props.config}
          userRoles={props.userRoles}
        /> : ""}
      <Link className="app-dashboard__app" to={props.link}
        onMouseDown={() => {
          props.setAppUserRoles(props.userRoles)
          props.setAppConfig({
            id: props.id,
            name: props.name,
            description: props.description,
            icon: props.icon,
            config: props.config
          })
      }}
      >
        {props.status === "favourite"? <span className="app-dashboard__app__status"><FontAwesomeIcon icon={['fas', 'star']} /></span> : ""}
        {props.status === "pinned"? <span className="app-dashboard__app__status"><FontAwesomeIcon icon={['fas', 'thumbtack']} /></span> : ""}
        {props.status === "updated"? <span className="app-dashboard__app__status"><FontAwesomeIcon icon={['fas', 'tools']} /></span> : ""}
        <span className="app-dashboard__app__icon">{props.icon}</span>
        <h2 className="app-dashboard__app__title">{props.name}</h2>
      </Link>
    </div>
  );
}

export default function MyApps(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [userApps, setUserApps] = useState(null)
  
  const allowedApps = items.filter(item => Object.keys(userApps|| {}).includes(item.name));

  document.title = "RailHub Evo - Dashboard";

  const appsAPI =  `${process.env.REACT_APP_BASE_URL}/api/railhub/secured/apps`;

  useEffect(() => {
    axios.get(appsAPI)
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.data.data.railApps);
          let userApps = result.data.data.userApps || {};
          userApps["Line Blockage Requests - IN DEV"] = ["Line Blockage Requests - IN DEV"];
          setUserApps(userApps);
          console.log(result.data.data);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
    }, [])

  let apps = "";
  if (error) {
    apps = <div className="app-dashboard__loading">
        <FontAwesomeIcon icon={['fas', 'frown']} className="app-dashboard__error-icon" />
        <h2>Oops!</h2>
        <p>Sorry, there was a problem loading your apps.</p>
        <p>Error: {error.message}</p>
      </div>; 
  } else if (!isLoaded) {
    apps = <div className="app-dashboard__loading">
        <SquaresShuffle />
        <h2>Loading...</h2>
        <p>Fetching your apps for you.</p>
      </div>;  
  } else {
    apps = allowedApps.map( (app, i) => <App key={i}
      name={app.name? app.name : "App"}
      icon={app.icon? <FontAwesomeIcon icon={['fas', app.icon]} /> : <FontAwesomeIcon icon={['fas', 'mobile-alt']} />}
      link={app.link? app.link : "/app/"}
      description={app.description? app.description : undefined}
      status={app.status? app.status : undefined}
      id={app._id.$oid? app._id.$oid : ""}
      setAppConfig={props.setAppConfig}
      setAppUserRoles={props.setAppUserRoles}
      config={app}
      userRoles={userApps ? userApps[app.name] : []}
    /> );

    /* --------- Test / Development apps temporary ------- */ 
    apps.push(
      <App key="justAtest1"
        name={DavidsTestAppConfig.name? DavidsTestAppConfig.name : "App"}
        icon={DavidsTestAppConfig.icon? <FontAwesomeIcon icon={['fas', DavidsTestAppConfig.icon]} /> : <FontAwesomeIcon icon={['fas', 'mobile-alt']} />}
        link={DavidsTestAppConfig.link? DavidsTestAppConfig.link : "/app/"}
        description={DavidsTestAppConfig.description? DavidsTestAppConfig.description : undefined}
        status={DavidsTestAppConfig.status? DavidsTestAppConfig.status : undefined}
        id={DavidsTestAppConfig._id.$oid? DavidsTestAppConfig._id.$oid : ""}
        setAppConfig={props.setAppConfig}
        config={DavidsTestAppConfig}
      />
    );
    apps.push(
      <App key="justAtest2"
        name={GoncalosTestAppConfig.name? GoncalosTestAppConfig.name : "App"}
        icon={GoncalosTestAppConfig.icon? <FontAwesomeIcon icon={['fas', GoncalosTestAppConfig.icon]} /> : <FontAwesomeIcon icon={['fas', 'mobile-alt']} />}
        link={GoncalosTestAppConfig.link? GoncalosTestAppConfig.link : "/app/"}
        description={GoncalosTestAppConfig.description? GoncalosTestAppConfig.description : undefined}
        status={GoncalosTestAppConfig.status? GoncalosTestAppConfig.status : undefined}
        id={GoncalosTestAppConfig._id.$oid? GoncalosTestAppConfig._id.$oid : ""}
        setAppConfig={props.setAppConfig}
        config={GoncalosTestAppConfig}
      />
    );
    apps.push(
      <App key="justAtest3"
        name={GoransTestAppConfig.name? GoransTestAppConfig.name : "App"}
        icon={GoransTestAppConfig.icon? <FontAwesomeIcon icon={['fas', GoransTestAppConfig.icon]} /> : <FontAwesomeIcon icon={['fas', 'mobile-alt']} />}
        link={GoransTestAppConfig.link? GoransTestAppConfig.link : "/app/"}
        description={GoransTestAppConfig.description? GoransTestAppConfig.description : undefined}
        status={GoransTestAppConfig.status? GoransTestAppConfig.status : undefined}
        id={GoransTestAppConfig._id.$oid? GoransTestAppConfig._id.$oid : ""}
        setAppConfig={props.setAppConfig}
        config={GoransTestAppConfig}
      />
    );
    /* --------- End Test / Development apps temporary ------- */ 

  }

  return (
    <div className="app-dashboard">
      {apps}
    </div>
  );
}