import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { eachRecursiveInput, getPropertyByString } from '../../../Helpers/StringHelpers'

import { useLocation, Route, Routes } from "react-router-dom"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleRight } from '@fortawesome/free-solid-svg-icons'
import InfoBox from '../../base/InfoBox'
import SquaresShuffle from '../../components/SquaresShuffle'

import GenerateInputsFromSchema from './GenerateInputsFromSchema'
import SingleRecordCRUDMenu from './SingleRecordCRUDMenu'
import DocumentHistory from './DocumentHistory'
import SingleRecordView from './SingleRecordView'
import SingleRecordAdd from './SingleRecordAdd'
import SingleRecordEdit from './SingleRecordEdit'

import DocumentStatus from '../../components/DocumentStatus'
import OutsideClick from '../../../Helpers/OutsideClick'
import DeleteDialogue from '../../components/DeleteDialogue'
import CreateUpdateDialogue from '../../components/CreateUpdateDialogue'
import { migrate } from '../../../Service/Migration'
// import MigrationIssuesAlert from '../../Alerts/MigrationIssuesAlert'


export default function SingleRecord(props) {
  const ref = useRef();
  const [showDelete, setShowDelete] = useState(false);
  OutsideClick(ref, () => setShowDelete(false));

  const [error, setError] = useState(null)
  const [migrationWarnings, setMigrationWarnings] = useState()
  const [isLoaded, setIsLoaded] = useState(false)
  const [items, setItems] = useState({})
  const [showCreate, setShowCreate] = useState(false);
  const [data, setData] = useState();
  const [defaultVals, setDefaultVals] = useState();
  const [newSchema, setNewSchema] = useState()

  const currentRecords = localStorage.getItem('records') ? JSON.parse(localStorage.getItem('records')) : "";
  const initialValues = {}
  const addInitialValues = {}

  const location = useLocation()
  
  const currentPathName = location.pathname  
  const config = currentPathName.includes('/edit') || currentPathName.includes('/create') ? props.config.railFormsConfig.createUpdateConfig : props.config.railFormsConfig.viewConfig;
  const roles = props.config.allCapabilities ? props.config.allCapabilities : [];
  const statusValues = props.config.appDocumentTypes[0].statusValues;
  const statusList = statusValues.map((status) => {
    return { value: status, label: status.charAt(0).toUpperCase() + status.substring(1).toLowerCase() }
  });
  const title = config.formTitle ? config.formTitle : "Single Record View"
  const description = config.formDescription
  const formElements = config.pages[0].pageElements
  const formSubmitGoToPage = config.saveFormConfig && config.saveFormConfig.formSubmitGoTo? config.saveFormConfig.formSubmitGoTo : null
  const updateMoveNextEnabled = config.saveFormConfig && config.saveFormConfig.updateMoveNextEnabled? config.saveFormConfig.updateMoveNextEnabled : false
  //console.log(formSubmitGoToPage)
  const id = location.state && location.state.id ? location.state.id : items._id ? items._id.$oid : props.id ? props.id : "";
  //console.log(id)
  const apiLocation = `${process.env.REACT_APP_BASE_URL}/api/railhub/secured/document`
  const apiCollectionName = props.config.railFormsConfig.recordsViewConfig.documentTypeName
  const apiQuery = apiLocation + '/' + apiCollectionName + '/' + id
  const schema = props.config.appDocumentTypes[0].documentSchemaURI;
  const cols = props.cols ? props.cols : null;
  const viewType = props.viewType ? props.viewType : "view-record";
  let viewStyle = (props.width < 599) ? "mobile" : (props.width < 899) ? "tablet" : "desktop"

  useEffect(() => {
    handleSubmit();
  }, [id])

  const handleSubmit = () => {
    if (id) {
      setIsLoaded(false)
      setNewSchema()
      axios.get(apiQuery)
        .then(
          async (result) => {
            if (result.data.success) {
              // console.log("result.data.data", result.data.data)
              
              if(result.data && result.data.data){
                if(config.documentVersion && result.data.data.$schema !== config.documentVersion){
                  let type = props.config.appDocumentTypes.find(type => type.documentSchemaURI === result.data.data.$schema)
                  try {
                    let response = await migrate(type.migrationHandler, id, type.documentSchemaURI)
                    // MigrationIssuesAlert(response.data.migrationIssues.map(issue => "Property: " + issue.property +  " - " + issue.issue).join(" "))
                    setMigrationWarnings(response.data.migrationIssues.map(issue => "Property: " + issue.property +  " - " + issue.issue).join(" "));
                    eachRecursiveInput(response.data.updatedDocument)
                    setItems(response.data.updatedDocument)
                    response.data.updatedDocument.locations ? setIsLoaded(false) : setIsLoaded(true)
                    setNewSchema(curr => config.documentVersion)
                    setData();
                    return;
                  } catch (error) {
                    console.log("migrate error", error)
                  }
                   
                  
                }
              }
              eachRecursiveInput(result.data.data)
              setItems(result.data.data)
              result.data.data.locations ? setIsLoaded(false) : setIsLoaded(true)
              setData();
            } else {
              setError(error)
              setIsLoaded(true)
            }
          },
          (error) => {
            setError(error)
            setIsLoaded(true)
            console.log(error)
          }
        )
    }
  }

  let linkedDocuments = null;

  useEffect(() => {
    linkedDocuments = items && items.locations ? items.locations : null
    let newDefaultVals = []
    if (linkedDocuments && Array.isArray(linkedDocuments)) {
      setIsLoaded(false)
      let promises = [];
      linkedDocuments.map((document) => {
        const id = document.refDoc ? document.refDoc['$oid'] : "id not found";
        const apiCollectionName = document.refDocCollection ? document.refDocCollection : "collection name not found"
        const apiQuery = apiLocation + '/' + apiCollectionName + '/' + id

        if (id) {
          promises.push(axios.get(apiQuery)
            .then(
              (result) => {
                if (result.data.success) {
                  newDefaultVals.push({ ...result.data.data, apiCollectionName: apiCollectionName, id: id, })
                  //setIsLoaded(true)
                  Promise.resolve(result.data.data)
                  //console.log(result.data.data)
                } else {
                  setError(error)
                  setIsLoaded(true)
                  //console.log(result.data)
                }
              },
              (error) => {
                setError(error)
                setIsLoaded(true)
                Promise.reject(error)
                //console.log(error)
              }
            ));
        }
        return null;
      })

      Promise.all(promises).then(results => {
        const documentShouldOrder = formElements.find((thisElement) => thisElement.hasOwnProperty('orderBy'))
        const orderBy = documentShouldOrder.orderBy
        //console.log(orderBy)
        
        if (orderBy) {
          const sortedVals = newDefaultVals.sort((a, b) => parseFloat(getPropertyByString(a, orderBy)) - parseFloat(getPropertyByString(b, orderBy)))
          setDefaultVals({ location: initialValues, documents: sortedVals })
          setIsLoaded(true)
          /* Test the sort ordering here */
          sortedVals.map((doc) => {
            //console.log(`${doc.name} Order = ${getPropertyByString(doc, orderBy)}`)
            return null;
          })
        } else {
          setDefaultVals({ location: initialValues, documents: newDefaultVals })
          setIsLoaded(true)
        }
      })
    }
  }, [items])

  let documentError = [];
  let documentStatus = "";
  let documentModified = "";

  const filterArrays = (obj) => {
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        if (obj[key].length === 0) {
          delete obj[key];
        } else {
          const numKeys = Object.keys(obj[key][0]).length;
          //the protectionAndWarningSystems wont be setted, so the condition as to be Object.keys(item).length === numKeys -1 for the new ones
          //but then the old ones comes with protectionAndWarningSystems setted
          obj[key] = obj[key].filter(item => Object.keys(item).length > 1 && (Object.keys(item).length === numKeys || Object.keys(item).length === numKeys - 1));
        }
      } else if (typeof obj[key] === 'object') {
        filterArrays(obj[key]);
      }
    }
    return obj;
  }


  if (error) {
    documentError = <InfoBox type="warning" fullWidth >Error: {error.message}</InfoBox>
    documentStatus = "ERROR";
  } else if (!isLoaded) {
    documentStatus = "LOADING";
  } else if (isLoaded) {
    documentStatus = items.documentInfo.status;
    const modifiedDate = new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    }).format(new Date(items.documentInfo.lastModifiedAt));
    documentModified = "Last modified on " + modifiedDate + " by " + items.documentInfo.lastModifiedBy.name;
  }

  const inputProps = {
    formElements: formElements,
    initialValues: initialValues,
    addInitialValues: addInitialValues,
    items: items,
    currentRecords: currentRecords,
    id: id,
    apiCollectionName: apiCollectionName,
    schema: schema,
    viewStyle: viewStyle,
    isLoaded: isLoaded,
    defaultVals: defaultVals,
    data: data ? data : initialValues,
    setData: setData
  }

  const inputs = GenerateInputsFromSchema(inputProps)

  const newLocal = <CreateUpdateDialogue
    showModal={showCreate}
    setShowModal={setShowCreate}
    id={id}
    to={formSubmitGoToPage ? formSubmitGoToPage : "/app/records"}
    updateMoveNextEnabled={updateMoveNextEnabled}
    schema={newSchema ? newSchema :schema}
    statusOptions={statusList}
    documentInfo={items.documentInfo}
    documentHistory={items.documentHistory}
    mode={(location.pathname.includes("/edit"))? "update" : "create"}
    data={data}
    roles={roles}
    />

  return (
    <div className="app__page">
      <div className="app__page__header">
        {id ? <><div className="app__page__title">
          <h2>
            {title} <DocumentStatus
              status={documentStatus}
              onClick={roles.includes('UPDATE') ? () => {
                setData(isLoaded ? initialValues : null)
                setShowCreate(true)
              } : null}
            />
          </h2>
          
          <span className="small">{documentModified ? documentModified : "Please wait while your record loads"}</span>
        </div>
          {roles.includes('DELETE') ?
            <DeleteDialogue
              showDelete={showDelete}
              setShowDelete={setShowDelete}
              id={id}
              collectionName={apiCollectionName}
              to={"/app/records"}
            /> : null}
        </>
          : <div className="app__page__title">
            <h2>{title}</h2>
            <span className="small">{viewType === "splitscreen" ? "Record view" : "Create a new record"}</span>
          </div>
        }{newLocal}
        {id ? <SingleRecordCRUDMenu
          roles={roles}
          viewType={viewType}
          setData={setData}
          setShowDelete={setShowDelete}
          setShowCreate={setShowCreate}
          documentStatus={documentStatus}
          isLoaded={isLoaded}
          initialValues={initialValues}
          id={id}
        /> : ""
        }
      </div>
        <Routes>
          {roles.includes('READ') ?
            <Route path="history"
              element={<div className="app__page__tab tab-3">
                {!isLoaded ? <div className="app-dashboard__loading">
                  <SquaresShuffle />
                  <h2>Loading...</h2>
                  <p>Fetching your records for you.</p>
                </div> :
                  <DocumentHistory
                    error={error}
                    isLoaded={isLoaded}
                    history={items.documentHistory}
                    viewStyle={viewStyle}
                  />}
              </div>}
            />
            : null}
          {roles.includes('READ') ? <Route path="view"
            element={<div className="app__page__tab tab-1">
              {!isLoaded ? <div className="app-dashboard__loading">
                <SquaresShuffle />
                <h2>Loading...</h2>
                <p>Fetching your records for you.</p>
              </div> :
                <SingleRecordView
                  error={error}
                  isLoaded={isLoaded}
                  initialValues={initialValues}
                  items={items}
                  formElements={formElements}
                />}
            </div>}
          />
            : null}
          {id ? <Route path="edit/*" element={
            <> {!isLoaded ? <div className="app-dashboard__loading">
              <SquaresShuffle />
              <h2>Loading...</h2>
              <p>Fetching your records for you.</p>
            </div> :
              <SingleRecordEdit
                description={description}
                onUpdate={(data) => {
                  setData(data)
                  setShowCreate(true)
                }}
                defaultValues={isLoaded ? data ? data : defaultVals ? defaultVals : initialValues : null}
                //defaultValues={isLoaded ? data ? data : defaultVals && defaultVals.documents.length === initialValues.length? defaultVals : initialValues : null}

                inputs={isLoaded ? inputs : null}
                config={config}
                cols={cols}
                viewStyle={viewStyle} 
                {...inputProps}
                />}
              {/*newLocal*/}
            </>
          }
          /> : null}
          <Route path="*" element={
            viewType !== "splitscreen" ?
              <>
                <SingleRecordAdd
                  description={description}
                  onCreate={(data) => {
                    setData(data)
                    setShowCreate(true)
                  }}
                  defaultValues={data ? data : addInitialValues}
                  inputs={inputs}
                  config={config}
                  cols={cols}
                  viewStyle={viewStyle}
                  {...inputProps}
                />
                {/*newLocal*/}
              </>
              : <div className="app-dashboard__loading">
                <FontAwesomeIcon icon={faCircleRight} className="app-dashboard__error-icon" />
                <h2>Record View</h2>
                <p>Select a record on the right to view deatails here.</p>
              </div>
          }
          />
        </Routes>
      {documentError}
      {migrationWarnings && <InfoBox type="alert" fullWidth >Alert: {migrationWarnings}</InfoBox>}
    </div>
  )
}