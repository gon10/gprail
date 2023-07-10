import { faFrown, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import debounce from 'lodash.debounce'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { Input } from '../../base'
import ImageContext from '../../components/Image/ImageContext/ImageContext'
import InputLoading from '../../components/InputLoading'
import ServerTable from '../../components/ServerTable'
import SquaresShuffle from '../../components/SquaresShuffle'
import RecordCrud from './RecordCrud'
import RecordMeta from './RecordMeta'
import { formatDate, traverseObject } from '../../../Helpers/StringHelpers'
import AxiosService from '../../../Service/AxiosService';

export default function Records(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [initialItems, setInitialItems] = useState();
  const [statusFilterValue, setStatusFilterValue] = useState();
  const [searching, setSearching] = useState(false)
  const [sorting, setSorting] = useState(false)

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(props.config.railFormsConfig.recordsViewConfig.recordsPerPage);
  const [totalElements, setTotalElements] = useState(0);
  const handlePageSize = (val) => {
    setPage(1);
    setPageSize(val);
  };
  const [filters, setFilters] = useState(new Map());
  const [sort, setSort] = useState();
  const [currentSearchValue, setCurrentSearchValue] = useState("");

  const filterChangeCall = React.useCallback((newFilters, newSort, currentSearchValue) => {
    setSorting(true)
    let queryString = "";
    let currentStatus = "";

    newFilters.forEach((col, key) => {
      //TODO restrict to min of 3 chars so it does not spam the API. Could lead to problems if there is a column that only have "A" or "B" as value.
      if(col.Header === "Meta"){
        currentStatus = col.value;
      }
      const operator = col.fieldNames? "or" : "and";
      if (col.uiComponentName === "imageField") {
        let obj = initialItems[0][col.fieldName]
        for (let property in obj) {
          queryString += `&fields[]={"name":"${col.fieldName + "." + property}","filter":"${col.value}" ,${typeof obj[property] !== 'number' ? `"isRegex": true,` : ""}}`
        }
      }
      else if (col.uiComponentName === "dateField") {
        //console.log(col.value)
        let thisDate = new Date(col.value)
        let date = moment(thisDate).format("YYYY-MM-DD")
        //console.log(date)
        queryString += `&fields[]={"name":"${key.replace(/\[\d+\]/g, "")}","filter":"${date}" ${col.uiComponentName === "integerField" ? "" : `,"isRegex": true, "operator": "${operator}"`}}`
        //console.log(queryString)
      } else {
        queryString += `&fields[]={"name":"${key.replace(/\[\d+\]/g, "")}","filter":"${col.value}" ${((col.uiComponentName === "integerField")/* || (col.id === "Meta")*/) ? "" : `,"isRegex": true, "operator": "${operator}"`}}`
      }
    });
    let statusQuery = apiLocation + '?collectionName=' + collectionName + '&paginated=' + paginated + '&page=' + 1 + '&pageLimit=' + pageSize + queryString + (newSort || '');
    if (!currentSearchValue || currentSearchValue === "") {
      AxiosService.handleGetQuery(statusQuery).then(result => {
        setTotalElements(result.headers["x-total-count"])
        setIsLoaded(true);
        setStatusFilter(result);
        setItems(result.data.data);
        setError(null);
        setSorting(false)
        setStatusFilterValue(currentStatus)
      }).catch(error => {
        setIsLoaded(true);
        setError(error);
        setSorting(false)
      });
    }else{
      setSorting(false)
    }
  }, [])

  const debouncedFilterChangeCall = React.useCallback(debounce(filterChangeCall, 500), []);

  useEffect(() => {
    setSorting(true)
    debouncedFilterChangeCall(filters, sort,currentSearchValue)
  }, [filters, sort,currentSearchValue])

  const handleFilterChange = React.useCallback((column, filterValue) => {
    setCurrentSearchValue("");
    setValues(initialVals)
    setError(null)
    const newFilters = new Map(filters);
    let colName = column.id === "Meta" ? "documentInfo.status" : column.fieldName
    if (column.targetField) {
      colName = `${column.fieldName}[0].${column.targetField}`
    }
    let colValue = column.uiComponentName === "booleanField" ? filterValue === "Yes" ? "true" : "false" : filterValue

    if ((colValue && column.fieldName) || (column.id === "Meta" && colValue)) {
      //console.log(`colValue = ${colValue} column.fieldName = ${column.fieldName}`)
      newFilters.set(colName, { ...column, value: colValue, });
    } else if (column.fieldNames) {
      if (colValue) {
        //console.log(`colValue = ${colValue} column.fieldNames = ${column.fieldNames}`)
        column.fieldNames.map((fieldName) => {
          newFilters.set(fieldName, { ...column, value: colValue, })
          if (column.targetField) {
            colName = `${fieldName}[0].${column.targetField}`
            newFilters.set(colName, { ...column, value: colValue, })
          }
          return null
        })
      } else {
        column.fieldNames.map((fieldName) => {
          newFilters.delete(fieldName)
          if (column.targetField) {
            colName = `${fieldName}[0].${column.targetField}`
            newFilters.delete(colName)
          }
          return null
        })
      }
      
    } else {
      newFilters.delete(colName)
    }
    setFilters(newFilters);
    setPage(1);
  }, [filters]);

  const apiLocation = `${process.env.REACT_APP_BASE_URL}/api/railhub/secured/documents`;
  const collectionName = props.config.railFormsConfig.recordsViewConfig.documentTypeName;
  const paginated = true; /* will be props.config.railFormsConfig.recordsViewConfig.pagination in future */
  const pageStart = 1;
  const recordsPerPage = props.config.railFormsConfig.recordsViewConfig.recordsPerPage;
  const roles = props.config.allCapabilities ? props.config.allCapabilities : [];
  const columnsConfig = props.config.railFormsConfig.recordsViewConfig.columns;
  const viewType = props.viewType ? props.viewType : "view-record";
  const crudTargets = props.config.railFormsConfig.recordsViewConfig.crudTargets;
  let viewStyle = (props.width < 599) ? "mobile" : (props.width < 899) ? "tablet" : "desktop"
  const defaultFilterValues = props.config.railFormsConfig.recordsViewConfig.defaultFilterValues ? props.config.railFormsConfig.recordsViewConfig.defaultFilterValues.split(/[.[\]]+/).filter(function (e) { return e; }) : null
  const wildCardSearchParams = props.config.wildCardSearchParams ? props.config.wildCardSearchParams: null;
  const defaultOrderBy = props.config.railFormsConfig.recordsViewConfig.defaultOrderBy ? props.config.railFormsConfig.recordsViewConfig.defaultOrderBy : "";
  const defaultDescend = props.config.railFormsConfig.recordsViewConfig.defaultDescend ? props.config.railFormsConfig.recordsViewConfig.defaultDescend : false;
  let orderBy = "";
  if (!defaultDescend) {
    orderBy = '&orderBy='+defaultOrderBy+'&ascending=true';
  } else {
    orderBy = '&orderBy='+defaultOrderBy+'&descending=true';
  }
  const [orderByCurrentState, setOrderBy] = useState(orderBy);

  const apiQuery = apiLocation + '?collectionName=' + collectionName + '&paginated=' + paginated + '&page=' + page + '&pageLimit=' + pageSize+ orderByCurrentState;

  //const optionList = ["DRAFT","APPROVED","WITHDRAWN"];
  const optionList = props.config.appDocumentTypes[0].statusValues;
  let columns = [];
  //console.log(columnsConfig)

  columnsConfig.map((column, i) => {

    let thisColumn = { ...column };
    thisColumn.Header = column.columnTitle;
    thisColumn.uiComponentName = column.uiComponentName;

    switch (column.uiComponentName) {
      case "textField":
        thisColumn.type = "string"
        break;
      case "integerField":
        thisColumn.type = "number"
        break;
      case "imageField":
        thisColumn.type = "image"
        break;
      case "dateField":
        thisColumn.type = "date"
        break;
      case "arrayField":
        thisColumn.type = "array"
        break;
      case "elrField":
        thisColumn.type = "elr"
        break;
      default:
        thisColumn.type = "string"
    }

    if (thisColumn.type === "string" || thisColumn.type === "number") {
      if (column.fieldName && column.fieldName.includes("[0]")) {
        thisColumn.accessor = column.fieldName
      } else {
        thisColumn.accessor = d => {
          if (column.fieldName) {

            return traverseObject(d, column.fieldName)

          } else if (column.fieldNames) {
            let returnValue = [];
            column.fieldNames.forEach((fieldName) => {
              let fieldValue = traverseObject(d, fieldName)
              if (fieldValue) {
                returnValue.push(fieldValue)
              }
            })
            if (returnValue.length === 1) {
              return returnValue.toString()
            } else {
              return returnValue
            }
          }
        }
      }
      thisColumn.Cell = ({ value }) => {
        if (typeof value === "object") {
          let content = []
          value.map((val, i) => {
            if (val !== "undefined" && typeof val === "string") {
              content.push(<li key={i}>{val}</li>)
            }
            return null
          })
          return (
            <ul>
              {content}
            </ul>
          )
        } else {
          return value
        }
      };
    } else if (thisColumn.type === "image") {
      thisColumn.accessor = column.fieldName
      thisColumn.Cell = ({ value, row }) => {
        if (value) {
          const thumbnail = value.attachmentId ? `${process.env.REACT_APP_BASE_URL}/api/railhub/attachment/${value.attachmentId}.png?thumbnailWidth=150` : null
          const thisId = row.original._id['$oid']
          return <ImageContext type="tableCell"
            id={thisId}
            src={thumbnail}
          />
        }
      };
    } else if (thisColumn.type === "date") {
      thisColumn.accessor = d => {
        if (column.fieldName) {
          return traverseObject(d, column.fieldName)
        } else if (column.fieldNames) {
          let returnValue = [];
          column.fieldNames.forEach((fieldName) => {
            let fieldValue = traverseObject(d, fieldName)
            if (fieldValue) {
              returnValue.push(fieldValue)
            }
          })
          if (returnValue.length === 1) {
            return returnValue.toString()
          } else {
            return returnValue
          }
        }
      }
      thisColumn.Cell = ({ value }) => {
        if (typeof value === "object") {
          let content = []
          value.map((val, i) => {
            if (val !== "undefined" && typeof val === "string") {
              content.push(<li className="res-table__td__li" key={i}>{formatDate(val)}</li>)
            }
            return null
          })
          return (
            <ul className="res-table__td__ul">
              {content}
            </ul>
          )
        } else {
          return formatDate(value)
        }
      };
    } else if (thisColumn.type === "array") {
      thisColumn.accessor = d => {
        let returnValue = [];
        if (column.fieldName) {
          let parentObj = traverseObject(d, column.fieldName)
          if (parentObj && parentObj.constructor === Array) {
            parentObj.forEach((objectFromArray) => {
              let thisValue = traverseObject(objectFromArray, column.targetField)
              returnValue.push(thisValue)
            })
          } else {
            //toDo if there isn't a target property because parentObj isn't an object then capture parentObj instead
          }
        } else if (column.fieldNames) {
          column.fieldNames.forEach((fieldName) => {
            let parentObj = traverseObject(d, fieldName)
            if (parentObj && parentObj.constructor === Array) {
              parentObj.forEach((objectFromArray) => {
                let thisValue = traverseObject(objectFromArray, column.targetField)
                returnValue.push(thisValue)
              })
            } else {
              //toDo if there isn't a target property because parentObj isn't an object then capture parentObj instead
            }
          })
        }
        return returnValue
      }
      thisColumn.Cell = ({ value }) => {
        if (typeof value === "object") {
          let content = []
          value.map((val, i) => {
            if (val !== "undefined" && typeof val === "string") {
              content.push(<li className="res-table__td__li" key={i}>{val}</li>)
            }
            return null
          })
          return (
            <ul className="res-table__td__ul">
              {content}
            </ul>
          )
        } else {
          return value
        }
      };
    } else if (thisColumn.type === "elr") {
      thisColumn.accessor = d => {
        let returnValue = [];

        if (column.fieldName) {
          let parentObj = traverseObject(d, column.fieldName)
          if (parentObj && parentObj.constructor === Array) {
            parentObj.forEach((objectFromArray) => {
              let thisValue = traverseObject(objectFromArray, column.targetField)
              returnValue.push(thisValue)
            })
          }
        } else if (column.fieldNames) {
          column.fieldNames.forEach((fieldName) => {
            let parentObj = traverseObject(d, fieldName)
            if (parentObj && parentObj.constructor === Array) {
              parentObj.forEach((objectFromArray) => {
                let thisValue = traverseObject(objectFromArray, column.targetField)
                returnValue.push(thisValue)
              })
            }
          })
        }
        return returnValue
      }
      thisColumn.Cell = ({ value }) => {
        let elrArray = []
        value.forEach((val, i) => {
          const from = val[0].from
          const to = val[0].to
          elrArray.push(
            <div className="res-table__elr-cell" key={i}>
              <div className="res-table__elr-cell__location"><b>From: </b>{from.elr.code} {from.trackId} {`[${from.mileage.milesChains.displayValue}]`}</div>
              <div className="res-table__elr-cell__location"><b>To: </b>{to.elr.code} {to.trackId} {`[${to.mileage.milesChains.displayValue}]`}</div>
            </div>
          )
        })
        return elrArray
      };
    } else {
      thisColumn.Cell = ({ value, row }) => (
        (typeof value === "string") ? value :
          (typeof value === "number") ? value :
            (typeof value === "boolean") ? value ? "Yes" : "No" :
              (typeof value === "object") ?
                Object.keys(value).map(function (key, i) {
                  let thisValue = value[key];
                  if (typeof thisValue === "object") {
                    if (thisValue['$oid']) {
                      return (
                        <div key={thisValue['$oid']} className="res-table__value-list">
                          <span className="res-table__value-list__key">{String(key)}</span>&nbsp;
                          <span className="res-table__value-list__value">{String(thisValue['$oid'])}</span>
                        </div>)
                    } else {
                      Object.keys(thisValue).map(function (k, v) {
                        return (
                          <div key={k} className="res-table__value-list">
                            <span className="res-table__value-list__key">{String(k)}</span>&nbsp;
                            <span className="res-table__value-list__value">{String(v)}</span>
                          </div>)
                      });
                    }
                  } else if (moment(thisValue, moment.ISO_8601, true).isValid()) {
                    let formattedDate = value[key] ? new Intl.DateTimeFormat("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true
                    }).format(new Date(value[key])) : "";
                    thisValue = formattedDate;
                  }
                  return (
                    <div key={i} className="res-table__value-list">
                      <span className="res-table__value-list__key">{String(key)}:</span>&nbsp;
                      <span className="res-table__value-list__value">{String(thisValue)}</span>
                    </div>)
                }) :
                (typeof value === "undefined" || value === undefined) ? "" :
                  <span>{typeof value}</span>
      );
    }
    
    if (column.targetField) {
      thisColumn.id = column.fieldName? `${column.fieldName}.${column.targetField}` : column.fieldNames? `${column.fieldNames[0]}.${column.targetField}` : null;
    } else {
      thisColumn.id = column.fieldName? column.fieldName : column.fieldNames? column.fieldNames[0] : null;
    }


    columns.push(thisColumn);
    //console.log(thisColumn);
    return null;
  });

  let metaColumn = {
    Header: "Meta",
    accessor: d =>
      <RecordMeta
        id={d._id.$oid}
        roles={roles}
        status={d.documentInfo.status}
        createdAt={d.documentInfo.createdAt}
        createdBy={d.documentInfo.createdBy ? d.documentInfo.createdBy.name : "name missing"}
        lastModifiedAt={d.documentInfo.lastModifiedAt}
        lastModifiedBy={d.documentInfo.lastModifiedBy.name}
        dataLineage={d.dataLineage}
        version={d._version}
        viewType={viewType}
        crudTargets={crudTargets}
      />,
    type: 'button',
    sortDisabled: true,
  };
  columns.push(metaColumn);

  let crudColumn = {
    Header: "Controls",
    accessor: d => {
      if (defaultFilterValues) {
        let thisFilter = d;
        defaultFilterValues.forEach((v) => {
          thisFilter = thisFilter[v];
        });

        return <RecordCrud
          id={d._id.$oid}
          filterValue={thisFilter}
          roles={roles}
          collectionName={collectionName}
          api={apiLocation}
          status={d.documentInfo.status}
          viewType={viewType}
          crudTargets={crudTargets}
        />
      } else {
        return <RecordCrud
          id={d._id.$oid}
          roles={roles}
          collectionName={collectionName}
          api={apiLocation}
          status={d.documentInfo.status}
          viewType={viewType}
          crudTargets={crudTargets}
        />
      }
    },
    type: 'button',
    sortDisabled: true,
  };
  columns.push(crudColumn);

  /* Search controlled input */
  const initialVals = {
    search: "",
  };
  const [values, setValues] = useState(initialVals);
  useEffect(() => {
  }, [values])
  function handleInputChange(e) { console.log(e); setValues((values) => ({ ...values, [e.target.name]: e.target.value })); }

  function handleSubmit() {
    setSearching(true)
    if (!values.search || values.search === "") {
      fetchInitialData(apiQuery);
      return;
    }
    const propsToUse = {
      collectionName: collectionName,
      query: values.search,
      wildCardSearchParams: wildCardSearchParams,
      page: pageStart-1,
      pageLimit: recordsPerPage
    };
    handleWildCardSearch(propsToUse);
    setPage(1);
    setError(null);
  }

  function statusFilter(status) {
    setIsLoaded(false);
    const filterQuery = status ? '&fields[]={"name":"documentInfo.status","filter":"' + status + '"}' : "";
    const statusQuery = apiLocation + '?collectionName=' + collectionName + '&paginated=' + paginated + '&page=' + pageStart + '&pageLimit=' + recordsPerPage + filterQuery + orderByCurrentState;

    AxiosService.handleGetQuery(statusQuery).then(result => {
      setIsLoaded(true);
      setSearching(false)
      setStatusFilter(result);
      setItems(result.data.data);
      setError(null);
      setStatusFilterValue(status)
    }).catch(error => {
      setIsLoaded(true);
      setError(error);
      setSearching(false)
    });
  }

  const fetchInitialData = () => {
    AxiosService.handleGetQuery(apiQuery).then(result => {
      setTotalElements(result.headers["x-total-count"])
      setIsLoaded(true);
      setSearching(false)
      setPage(1);
      setStatusFilter(result);

      localStorage.setItem('records', JSON.stringify(result.data.data));
      setItems(result.data.data);
      if (!initialItems) {
        setInitialItems(result.data.data)
      }

      setError(null);
      setSearching(false)
    }).catch(error => {
      setIsLoaded(true);
      setSearching(false)
      setError(error);
    });
  };

  /* if there are images in the data then create a lightbox popup to go with the table */
  //const [lightboxClose, setLightboxClose] = useState(true)
  //const [lightboxSelected, setLightboxSelected] = useState();
  //let images = []

  /*if (items.some(item => item.diagram !== undefined)) {
    images = items.map(item => {
      const image = {
        id: item._id['$oid'],
        title: item.lineOfRoute[0].code,
        alt: item.lineOfRoute[0].name,
        src: item.diagram.attachmentId ? `${process.env.REACT_APP_BASE_URL}/api/railhub/attachment/${item.diagram.attachmentId}.png?thumbnailWidth=original` : ""
      };
      return image;
    })
  }*/

  /*function filmstripClick(e, imageArray) {
    const thisImageId = e.currentTarget.id;
    //console.log(thisImageId)
    //console.log(imageArray)
    imageArray.map((image) => {
      if (image.id === thisImageId) {
        setLightboxSelected(image);
      }
      return null;
    })
  }*/

  //console.log(images)
  //console.log(lightboxSelected)

  /*function handleGalleryClick(e, imageArray) {
    const thisImageId = e.currentTarget.id;
    console.log(thisImageId)
    imageArray.map((image) => {
      if (image.id === thisImageId) {
        setLightboxSelected(image);
      }
      return null;
    })
    setLightboxClose(false);
  }*/

  const handleSubmitWithPagination = (pageVal, pageSizeVal, sortByVal, sortOrderVal) => {
    let pageNumber = pageVal === 0 ? 0 : pageVal || page || 0;
    let pageSizeNumber = pageSizeVal === 0 ? 0 : pageSizeVal || pageSize || 0;
    // let sortByAux = sortByVal || sortBy || null;
    // let sortOrderAux = sortOrderVal || sortOrder || null;
    let queryString = ""
    let currentStatus = "";
    filters.forEach((col, key) => {
      //TODO restrict to min of 3 chars so it does not spam the API. Could lead to problems if there is a column that only have "A" or "B" as value.
      if(col.Header === "Meta"){
        currentStatus = col.value;
      }
      if (col.uiComponentName === "imageField") {
        let obj = initialItems[0][col.fieldName]
        for (let property in obj) {
          queryString += `&fields[]={"name":"${col.fieldName + "." + property}","filter":"${col.value}" ,${typeof obj[property] !== 'number' ? `"isRegex": true,` : ""}  "operator": "or"}`
        }

      }
      else {
        queryString += `&fields[]={"name":"${key.replace(/\[\d+\]/g, "")}","filter":"${col.value}" ${col.uiComponentName === "integerField" ? "" : `,"isRegex": true`}}`
      }

    });

    setIsLoaded(false);
    const apiQuery = apiLocation + '?collectionName=' + collectionName + '&paginated=' + paginated + '&page=' + pageNumber + '&pageLimit=' + pageSizeNumber + queryString+ orderByCurrentState;

    if (!values.search || values.search === "") {
      AxiosService.handleGetQuery(apiQuery).then(result => {
        setIsLoaded(true);
        setSearching(false)
        // fix of booleans because of column change from true to Yes and false to No
        setStatusFilter(result);
        // End of fix
        localStorage.setItem('records', JSON.stringify(result.data.data));
        setItems(result.data.data);
        setError(null);
        setSearching(false)
        setStatusFilterValue(currentStatus)
      }).catch(error => {
        setIsLoaded(true);
        setError(error);
        setSearching(false)
      });
    }else{

      const propsToUse = {
        collectionName: collectionName,
        query: values.search,
        wildCardSearchParams: wildCardSearchParams,
        page: pageNumber-1,
        pageLimit: pageSizeNumber
      };
      handleWildCardSearch(propsToUse);
    }
  }

  const handleWildCardSearch = (propsToUse) => {
    AxiosService.handlePostQuery(apiLocation,propsToUse).then(result => {
      setCurrentSearchValue(values.search);
      setIsLoaded(true);
      setItems(result.data.data);
      setTotalElements(result.headers["x-total-count"]);
      setSearching(false)
      setFilters(new Map())
      setStatusFilterValue("Select..")
    }).catch(error => {
      setIsLoaded(true);
      setError(error);
      //console.log(error);
      setSearching(false)
    })
  }

  const handleSort = (sortBy) => {
    setCurrentSearchValue("");
    setValues(initialVals)
    const column = sortBy[0];
    let newSort = '';

    if (column) {
      let colName = column.id === "Meta" ? "documentInfo.status" : column.id

      const sortName = colName.replace(/\[\d+\]/g, "")

      if (!column.desc) {
        newSort = `&orderBy=${sortName}&ascending=true`
      } else {
        newSort = `&orderBy=${sortName}&descending=true`
      }
    }
    setOrderBy(newSort);
    setSort(newSort);
  }


  const setStatusFilter = (result) => {
    result.data.data.map((items, i) => {
      Object.keys(items).map(function (key, j) {
        let thisValue = items[key];

        if (typeof thisValue === "string" || typeof thisValue === "number" || typeof thisValue === "object") {
        } else if (typeof thisValue === "boolean") {
          items[key] = "No";
          if (thisValue) {
            items[key] = "Yes";
          }
        } else if (Object.prototype.toString.call(new Date(thisValue)) === '[object Date]') {
          let formattedDate = new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "numeric",
            minute: "numeric",
            hour12: true
          }).format(new Date(thisValue))
          items[key] = formattedDate
        }
        return items[key];
      })
      return items;
    })
  }

  return (
    <div className="app__page">
      <div className="app__page__header">
        <h2>Records</h2>
        <div className="app__page__actions">
          {searching ? <InputLoading className="app__page__search" noLabel noMargin searchButton /> : <Input className="app__page__search"
            type="search" name="search" noLabel noMargin
            onChange={(e) => handleInputChange(e)}
            onSearch={(e) => handleSubmit(e)}
            value={values.search}
            placeholder="Search" />}
          {roles.includes('CREATE') ?
            <Link to="/app/view-record/create/*" className="button button--primary app__page__button">
              <FontAwesomeIcon icon={faPlus} className="button__icon" /> Add Record
            </Link>
            : null}
        </div>
      </div>
      {/* {records} */}
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

      <ServerTable
        columns={columns}
        data={items}
        recordsPerPage={pageSize}
        withFilters={true}
        loading={!isLoaded}
        statusFilter={statusFilter}
        statusFilterValue={statusFilterValue}
        optionList={optionList}
        openFilters={statusFilterValue ? true : false}
        tabletView={viewStyle === "tablet" ? true : false}
        mobileView={viewStyle === "mobile" ? true : false}
        currentPage={page}
        totalPages={Math.ceil(totalElements / pageSize) || 1}
        pageSizeBE={pageSize}
        totalElements={totalElements}
        onSort={handleSort}
        sorting={sorting}
        defaultOrderBy = {defaultOrderBy}
        defaultDescend = {defaultDescend}
        setPage={(val) => {
          setPage(val);
          handleSubmitWithPagination(val, undefined);
        }}
        setPageSizeBE={(val) => {
          handlePageSize(val);
          handleSubmitWithPagination(1, val);
        }}
        filters={filters}
        handleFilterChange={handleFilterChange}
      />
      {!error && isLoaded && items.length === 0 && <div className="app-dashboard__loading">
        <FontAwesomeIcon icon={faFrown} className="app-dashboard__error-icon" />
        <h2>No records found</h2>
        <p>Please try a different search or create records.</p>
      </div>}

      {/*!error && isLoaded && images.length > 0 && <ImageContext
        id={lightboxSelected ? lightboxSelected.id : images[0].id}
        alt={lightboxSelected ? lightboxSelected.alt : images[0].alt}
        src={lightboxSelected ? lightboxSelected.src : images[0].src}
        images={images}
        disabled={false}
        type="lightbox-fullscreen"
        helpText={props.config.description}
        filmstripClick={filmstripClick}
        lightboxClose={lightboxClose}
        setLightboxClose={setLightboxClose}
        lightboxSelected={lightboxSelected}
        setLightboxSelected={setLightboxSelected}
      />
      */}
    </div>
  );
}