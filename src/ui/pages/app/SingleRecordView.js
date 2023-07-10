import React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrown } from '@fortawesome/free-solid-svg-icons'
import SquaresShuffle from '../../components/SquaresShuffle'

export default function SingleRecordView(props) {
  const error = props.error
  const isLoaded = props.isLoaded
  const initialValues = props.initialValues
  const items = props.items
  const formElements = props.formElements
 // let initialRows = 0;
  let readView = [];

  formElements.map((input, key) => {
    const fieldName = input.boundFieldName ? input.boundFieldName : "";
    const label = input.prompt ? input.prompt : "Missing Label";

    if (error) {
      readView = <div className="app-dashboard__loading">
        <FontAwesomeIcon icon={faFrown} className="app-dashboard__error-icon" />
        <h2>Oops!</h2>
        <p>Sorry, there was a problem loading this record.</p>
        <p>Error: {error.message}</p>
      </div>
    } else if (!isLoaded) {
      readView = <div className="app-dashboard__loading">
        <SquaresShuffle />
        <h2>Loading...</h2>
        <p>Fetching this record for you.</p>
      </div>
    } else if (isLoaded) {
      initialValues[fieldName] = items[fieldName]
      if (Array.isArray(items[fieldName])) {
        //initialRows = items[fieldName].length
      }

      readView.push(<p key={key} className="view-record__item">
        <b className="view-record__label">{label}:</b>&nbsp;
        <span className="view-record__value">{
          (typeof items[fieldName] === "string") ? items[fieldName] :
            (typeof items[fieldName] === "number") ? items[fieldName] :
              (typeof items[fieldName] === "boolean") ? items[fieldName] ? "Yes" : "No" :
                (Array.isArray(items[fieldName])) ? items[fieldName].map((ele, i) => (typeof ele === "object") ? <span key={i} className="view-record__array">{
                  Object.keys(ele).map(function (key, i) {
                    let thisValueArray = [];
                    let thisValue = ele[key];
                    if (typeof thisValue === "object") {
                      for (const [key, value] of Object.entries(thisValue)) {
                        let thisConfig = input.fields ? input.fields.find(item => item.boundFieldName === key) : null;
                        let thisTitle = thisConfig ? thisConfig.title : 'Missing title';
                        if (thisTitle === 'Missing title') {
                          continue;
                        }

                        if (typeof value === "object") {
                          thisValueArray.push(<b key={key} className="view-record__label ">{thisTitle}:</b>)
                          for (const [k, v] of Object.entries(value)) {
                            if (moment(v, moment.ISO_8601, true).isValid()) {
                              let formattedDate = v ? new Intl.DateTimeFormat("en-GB", {
                                year: "numeric",
                                month: "long",
                                day: "2-digit",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true
                              }).format(new Date(v)) : "";
                              thisValueArray.push(
                                <span key={key + k} className="view-record__value-list">
                                  <span className="view-record__value-list__key">{k}:
                                  </span>&nbsp;<span className="view-record__value-list__value">{formattedDate} </span>
                                </span>)
                            } else {
                              thisValueArray.push(
                                <span key={key + k} className="view-record__value-list">
                                  <span className="view-record__value-list__key">{k}:
                                  </span>&nbsp;<span className="view-record__value-list__value">{v} </span>
                                </span>)
                            }
                          }
                        } else if (typeof value === "boolean") {
                          thisValueArray.push(
                            <span key={key + key} className="view-record__value-list">
                              <span className="view-record__value-list__key">{key}:
                              </span>&nbsp;<span className="view-record__value-list__value">{value ? "Yes" : "No"}</span>
                            </span>)

                        } else {
                          thisValueArray.push(
                            <span key={key + key} className="view-record__value-list">
                              <span className="view-record__value-list__key">{thisTitle}:
                              </span>&nbsp;<span className="view-record__value-list__value">{value}</span>
                            </span>)
                        }

                      }
                      return <span key={key} className="view-record__array__record">{thisValueArray}</span>;
                    }
                    else if (moment(items[fieldName][key], moment.ISO_8601, true).isValid()) {
                      let formattedDate = new Intl.DateTimeFormat("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true
                      }).format(new Date(items[fieldName][key]))
                      thisValue = formattedDate
                      //console.log(items[fieldName][key])
                      const d = new Date(items[fieldName][key]);
                      initialValues[fieldName][key] = (new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()).slice(0, -1);
                      //console.log(initialValues[fieldName][key])
                    } else if (typeof thisValue === "boolean") {
                      return (
                        <span key={key + key} className="view-record__value-list">
                          <span className="view-record__value-list__key">{key}:
                          </span>&nbsp;<span className="view-record__value-list__value">{thisValue ? "Yes" : "No"}</span>
                        </span>)
                    }
                    return (
                      <span key={i} className="view-record__value-list">
                        <span className="view-record__value-list__key">{key}:
                        </span>&nbsp;<span className="view-record__value-list__value">{thisValue}</span>
                      </span>)
                  })}</span> :
                  (typeof items[fieldName] === "undefined") ? null :
                    <span>{typeof items[fieldName]}</span>) :
                  (typeof items[fieldName] === "object") ? <span className="view-record__array">{
                    Object.keys(items[fieldName]).map(function (key, i) {
                      let thisValueArray = [];
                      let thisValue = items[fieldName][key];
                      if (typeof thisValue === "object") {
                        for (const [key, value] of Object.entries(thisValue)) {
                          let thisConfig = input.fields ? input.fields.find(item => item.boundFieldName === key) : null;
                          let thisTitle = thisConfig ? thisConfig.title : 'Missing title';
                          if (thisTitle === 'Missing title') {
                            continue;
                          }

                          if (typeof value === "object") {
                            thisValueArray.push(<b key={key} className="view-record__label ">{thisTitle}:</b>)
                            for (const [k, v] of Object.entries(value)) {
                              if (moment(v, moment.ISO_8601, true).isValid()) {
                                let formattedDate = v ? new Intl.DateTimeFormat("en-GB", {
                                  year: "numeric",
                                  month: "long",
                                  day: "2-digit",
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true
                                }).format(new Date(v)) : "";

                                thisValueArray.push(
                                  <span key={key + k} className="view-record__value-list">
                                    <span className="view-record__value-list__key">{k}:
                                    </span>&nbsp;<span className="view-record__value-list__value">{formattedDate} </span>
                                  </span>)
                              } else {
                                thisValueArray.push(
                                  <span key={key + k} className="view-record__value-list">
                                    <span className="view-record__value-list__key">{k}:
                                    </span>&nbsp;<span className="view-record__value-list__value">{v} </span>
                                  </span>)
                              }
                            }
                          } else if (typeof value === "boolean") {
                            thisValueArray.push(
                              <span key={key + key} className="view-record__value-list">
                                <span className="view-record__value-list__key">{key}:
                                </span>&nbsp;<span className="view-record__value-list__value">{value ? "Yes" : "No"}</span>
                              </span>)

                          } else {
                            thisValueArray.push(
                              <span key={key + key} className="view-record__value-list">
                                <span className="view-record__value-list__key">{thisTitle}:
                                </span>&nbsp;<span className="view-record__value-list__value">{value}</span>
                              </span>)
                          }

                        }
                        return <span key={key} className="view-record__array__record">{thisValueArray}</span>;
                      }
                      else if (moment(items[fieldName][key], moment.ISO_8601, true).isValid()) {
                        let formattedDate = new Intl.DateTimeFormat("en-GB", {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true
                        }).format(new Date(items[fieldName][key]))
                        thisValue = formattedDate
                        //console.log(items[fieldName][key])
                        const d = new Date(items[fieldName][key]);
                        initialValues[fieldName][key] = (new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()).slice(0, -1);
                        //console.log(initialValues[fieldName][key])
                      }
                      return (
                        <span key={i} className="view-record__value-list">
                          <span className="view-record__value-list__key">{key}:
                          </span>&nbsp;<span className="view-record__value-list__value">{thisValue}</span>
                        </span>)
                    })}</span> :
                    (typeof items[fieldName] === "undefined") ? null :
                      <span>{typeof items[fieldName]}</span>
        }</span>
      </p>)
    }
    return null
  })

  return (
    <div className="app__page__read-view">
      <h3 className="app__page__read-view__title">View Record</h3>
      <p className="app__page__read-view__description">View single record details</p>
      {readView}
    </div>
  )
}