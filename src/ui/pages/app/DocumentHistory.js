import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrown } from '@fortawesome/free-solid-svg-icons'
import SquaresShuffle from '../../components/SquaresShuffle'
import Table from '../../components/Table'

export default function DocumentHistory(props) {
  const error = props.error
  const isLoaded = props.isLoaded
  const history = props.history
  const viewStyle = props.viewStyle

  let documentHistory = [];

  if (error) {

    documentHistory = <div className="app-dashboard__loading">
      <FontAwesomeIcon icon={faFrown} className="app-dashboard__error-icon" />
      <h2>Oops!</h2>
      <p>Sorry, there was a problem loading this document history.</p>
      <p>Error: {error.message}</p>
    </div>


  } else if (!isLoaded) {

    documentHistory = <div className="app-dashboard__loading">
      <SquaresShuffle />
      <h2>Loading...</h2>
      <p>Fetching document history for you.</p>
    </div>

  } else if (isLoaded) {

    let historyColumns = [
      { Header: "Version Ref", accessor: "version" },
      { Header: "Operation", accessor: "operation" },
      {
        Header: "Date/Time",
        accessor: d =>
          new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "numeric",
            minute: "numeric",
            hour12: true
          }).format(new Date(d.when))
      },
      { Header: "Changed by", accessor: "name" },
      {
        Header: "Comments",
        accessor: d =>
          d.comment === undefined ? '' : d.comment.split("\\n").map((item, key) => {
            return <span key={key}>{item}<br /></span>
          })

      },
    ]

    documentHistory = history ? <Table
      columns={historyColumns}
      data={history}
      recordsPerPage={20}
      tabletView={viewStyle === "tablet" ? true : false}
      mobileView={viewStyle === "mobile" ? true : false}
    /> : <div className="app-dashboard__loading">
      <FontAwesomeIcon icon={faFrown} className="app-dashboard__error-icon" />
      <h2>Oops!</h2>
      <p>Sorry, there was a problem loading this document history.</p>
      <p>Error: Missing documentHistory in JSON</p>
    </div>
  }

  return (
    <div className="app__page__history">
      <h3 className="app__page__history__title">History</h3>
      <p className="app__page__history__description">View changes to this document/record.</p>
      {documentHistory}
    </div>
  )
}