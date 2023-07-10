import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { faFrown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import SquaresShuffle from '../../components/SquaresShuffle'

import {  useLocation, useNavigate } from "react-router-dom"
import ImageContext from '../../components/Image/ImageContext/ImageContext'

export default function RecordsAsGallery(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState();

  const location = useLocation()
  const id = location.state &&location.state.id? location.state.id : props.id;
  const defaultFilter = props.config.railFormsConfig.recordsViewConfig.defaultFilter
  const filterValue = location.state &&location.state.filterValue? location.state.filterValue : props.filterValue;
  const navigate = useNavigate();

  const apiLocation = `${process.env.REACT_APP_BASE_URL}/api/railhub/secured/documents`
  const collectionName = props.config.railFormsConfig.recordsViewConfig.documentTypeName;
  const paginated = true; /* will be props.config.railFormsConfig.recordsViewConfig.pagination in future */
  const pageStart = 1;
  const pageLimit = 100;
  const queryString = `&fields[]={"name":"${defaultFilter}","filter":"${filterValue}" ,"isRegex": true}`
        
  const apiQuery = apiLocation + '?collectionName=' + collectionName + '&paginated=' + paginated+'&page='+pageStart+'&pageLimit='+pageLimit+ queryString;

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchInitialData();
    //console.log("fetch fired")
  }, [location]);

  const fetchInitialData = () => {
    setIsLoaded(false);
    axios.get(apiQuery).then(
      (result) => {
        const images = result.data.data.map((items, i) => {
          const thisImage = {
            id: items._id['$oid'],
            title: `${items.lineOfRoute[0].code} - ${items.sequence}`,
            alt: `${items.lineOfRoute[0].name}`,
            src: items.diagram.attachmentId? `${process.env.REACT_APP_BASE_URL}/api/railhub/attachment/${items.diagram.attachmentId}.png?thumbnailWidth=768` : null,
          }
          if (thisImage.id === id) {
            //console.log(`current chosen id = ${id}`)
            thisImage.selected = true
            setSelectedItem(thisImage);
            if (result.data.data[i+1]) {
              localStorage.setItem('nextId', JSON.stringify(result.data.data[i+1]._id['$oid']));
            } else {
              localStorage.removeItem('nextId')
            }
          }
          return thisImage;
        })

        localStorage.setItem('records', JSON.stringify(result.data.data));
        //setItems(images.filter((image) => image.id === id));
        setItems(images)
        setError(null);
        setIsLoaded(true);
      },
      (error) => {
        setError(error);
        setIsLoaded(true);
        //console.log(error);
      }
    );
  };

  function filmstripClick(e) {
    const thisImageId = e.currentTarget.id;
    //console.log(thisImageId)
   // console.log(filterValue)
    navigate("/app/splitscreen/edit" ,{state: {id: thisImageId, filterValue: filterValue}})
  }

  //console.log(items)

  return (
    <div className="app__page">
      <div className="app__page__header">
        <h2>{props.config.name} Lightbox</h2>
        <div className="app__page__actions">
        </div>
      </div>
      {error && <div className="app-dashboard__loading">
      <FontAwesomeIcon icon={faFrown} className="app-dashboard__error-icon" />
      <h2>Oops!</h2>
      <p>Sorry, there was a problem loading your records.</p>
      <p>Error: {error.message}</p>
      </div>}
      {!error && !isLoaded && <div className="app-dashboard__loading">
        <SquaresShuffle />
        <h2>Loading...</h2>
        <p>Fetching your records for you.</p>
      </div>}
      {!error && isLoaded && items.length === 0 && <div className="app-dashboard__loading">
        <FontAwesomeIcon icon={faFrown} className="app-dashboard__error-icon" />
        <h2>No records found</h2>
        <p>Please try a different search or create records.</p>
      </div>} 
      {!error && isLoaded && selectedItem && <ImageContext 
        id={selectedItem.id}
        alt={selectedItem.alt}
        src={selectedItem.src}
        images={items}
        disabled={false}
        type="lightbox"
        helpText={props.config.description}
        filmstripClick={filmstripClick}
      />}
    </div>
  );
}