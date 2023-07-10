import React, { useState, useMemo, useEffect } from 'react';
import { useTable, useSortBy, usePagination, useFilters } from 'react-table';
import { matchSorter } from 'match-sorter'
import { faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleLeft, faAngleDoubleRight, faAngleRight, faEllipsisV, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from '../base/Button';
import Input from '../base/Input';
import SingleOption from './SingleOption';

function DefaultColumnFilter({ column: { filterValue, setFilter, Header }, }) {
  return (
    <Input
      name={Header}
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search by ${Header}...`}
      noLabel noMargin
    />
  )
}
function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

function BooleanColumnFilter({
  column: { filterValue, setFilter },
}) {
  const options = [
    { label: "All", value: "" },
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" }
  ];

  return (
    <SingleOption
      //defaultInputValue={filterValue}
      value={filterValue? { 
        value: filterValue, 
        label: filterValue.charAt(0).toUpperCase() + filterValue.substring(1).toLowerCase()
      } : ""}
      //inputValue={filterValue}
      name="boolFilter"
      //onInputChange={e => { setFilter(e.value) }}
      onChange={e => { setFilter(e.value) }}
      options={options}
      displayType="dropdown"
      noLabel
      noMargin
    />
  )
}

function StatusColumnFilter({ column: { preFilteredRows, id }, statusFilter, statusFilterValue, optionList }) {
  const options = optionList ? optionList : React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id].props.status)
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  let statusOptions = [
    { value: "", label: "All" }
  ];

  options.map((option, i) =>
    statusOptions.push({ 
      value: option, 
      label: option.charAt(0).toUpperCase() + option.substring(1).toLowerCase()
    })
  );

  //console.log(statusOptions);
  return (
    <SingleOption
      defaultValue={statusFilterValue ? { 
        value: statusFilterValue, 
        label: statusFilterValue.charAt(0).toUpperCase() + statusFilterValue.substring(1).toLowerCase() 
      } : ""}
      value={statusFilterValue ? { 
        value: statusFilterValue, 
        label: statusFilterValue.charAt(0).toUpperCase() + statusFilterValue.substring(1).toLowerCase() 
      } : ""}
      //value={statusFilterValue ? statusFilterValue.toLowerCase() : ""}
      onChange={e => {
        statusFilter(e.value || undefined)
      }}
      options={statusOptions}
      displayType="dropdown"
      noLabel
      noMargin
    />
  )
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

export default function Table({
  columns,
  data,
  recordsPerPage,
  withFilters,
  dataTable,
  onRemoveRow,
  onAddRow,
  className,
  disabled,
  error,
  statusFilter,
  statusFilterValue,
  optionList,
  openFilters,
  loading,
  mobileView,
  tabletView,
  fullWidth,
  currentPage,
  totalPages,
  setPage,
  setPageSizeBE,
  pageSizeBE
}) {

  const filterTypes = useMemo(() => ({
    fuzzyText: fuzzyTextFilterFn,
    text: (rows, id, filterValue) => {
      return rows.filter(row => {
        const rowValue = row.values[id]
        return rowValue !== undefined
          ? String(rowValue)
            .trim()
            .toLowerCase()
            .replace(/ /g, '')
            .startsWith(String(filterValue).toLowerCase())
          : true
      })
    },
  }),
    [matchSorter]
  )

  const defaultColumn = React.useMemo(() => ({
    filter: 'fuzzyText'
  }))

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {
      pageIndex,
      pageSize
    },
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: recordsPerPage },
      autoResetFilters:false
      
    },
    useFilters,
    useSortBy,
    usePagination
  )

  const [showFilters, setShowFilters] = useState(openFilters ? true : false);

  const [pageNumber, setPageNumber] = useState(1);

  let classProps = ['res-table__wrap'];
  if (mobileView) { classProps.push('res-table__wrap--mobile')}
  if (tabletView) { classProps.push('res-table__wrap--tablet')}
  if (fullWidth) { classProps.push('res-table__wrap--full-width')}
  if (className) { classProps.push(className) }

  useEffect(() => {
    setPageNumber(pageIndex+1)
  }, [pageIndex])
  
  return (
    <>
    {!loading && 
    <div className={classProps.join(' ')}>
      <table className={dataTable ? "res-table res-table--data-table" : "res-table"} {...getTableProps()}>
        <thead className="res-table__thead">
          {headerGroups.map(headerGroup => (
            <tr className="res-table__tr" {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => {return (
                <th className={column.type ? "res-table__th res-table__th--" + column.type : "res-table__th"}
                  {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <span className="res-table__column-header__wrap">
                    <span className="res-table__column-header">{column.render('Header')} {column.required && <span className="small">[Required]</span>}</span>
                    
                    {column.sortDisabled ? null :
                      <span className="res-table__sort">
                        {column.isSorted
                          ? column.isSortedDesc
                            ? <FontAwesomeIcon icon={faSortUp} />
                            : <FontAwesomeIcon icon={faSortDown} />
                          : <FontAwesomeIcon icon={faSort} />}
                      </span>
                    }
                  </span>
                </th>
              )})}
              {withFilters ?
                <th className="res-table__th res-table__th--button res-table__th--filter-column">
                  <Button action="tertiary" className="res-table__header-button" onClick={() => setShowFilters(!showFilters)}>
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </Button>
                </th> : null}
              {dataTable ?
                <th className="res-table__th res-table__th--button res-table__th--remove-column">
                </th> : null}
            </tr>
          ))}
          {withFilters ?
            headerGroups.map(headerGroup => (
              <tr className={showFilters ? "res-table__tr res-table__tr--filters res-table__tr--filters--open" : "res-table__tr res-table__tr--filters"}
                {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th className={column.type ? "res-table__th res-table__th--" + column.type : "res-table__th"}
                    data-before={(column.canFilter && (column.Header !== 'Controls')) ? column.Header + ":" : null}
                    {...column.getHeaderProps()}>
                    {(column.canFilter && (column.Header !== 'Controls' && column.Header !== 'Meta')) ? 
                      (column.uiComponentName === "booleanField") ? <BooleanColumnFilter column={column} />
                      : column.render(DefaultColumnFilter) :
                      (column.Header === 'Meta') ? <StatusColumnFilter column={column} statusFilter={statusFilter}
                        statusFilterValue={statusFilterValue} optionList={optionList} /> :
                        null}
                  </th>
                ))}

                <th className="res-table__th res-table__th--button res-table__th--filter-column">
                </th>
              </tr>
            ))
            : null}
        </thead>
        <tbody className="res-table__tbody" {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            //console.log(row);
            return (
              <tr className="res-table__tr" {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td className={cell.column.type ? "res-table__td res-table__td--" + cell.column.type : "res-table__td"} {...cell.getCellProps()} data-before={cell.column.Header + ":"}>
                    {cell.render('Cell')}
                  </td>
                })}
                {withFilters ?
                  <td className="res-table__td res-table__td--button res-table__td--filter-column"></td> : ""}
                {dataTable ?
                  <td className="res-table__td res-table__td--button res-table__td--remove-column" onClick={(e) => {e.preventDefault()}}>
                    <Button action="tertiary" disabled={data.length <= 1}><FontAwesomeIcon icon={faTrashAlt}
                      onClick={disabled || data.length <= 1 ? (e) => {} : (e) => onRemoveRow(row.id, e)} /></Button>
                  </td> : null}
              </tr>
            )
          })}
        </tbody>
      </table>

      {totalPages && 
      <div className="pagination">
        <span className="pagination__page-no">Page <b>{currentPage} of {totalPages}</b></span>
                   
        <div className="pagination__buttons">
          <Button className="pagination__button" action="tertiary" onClick={() => setPage(1)} disabled={currentPage <= 1}>
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </Button>
          <Button className="pagination__button" action="tertiary" onClick={() => setPage(currentPage -1)} disabled={currentPage <= 1}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </Button>
          
          <span className="pagination__page-no--mobile-only">Page <b>{currentPage} of {totalPages}</b></span>
          <Button className="pagination__button" action="tertiary" onClick={() => setPage(currentPage + 1)} disabled={currentPage >= totalPages}>
            <FontAwesomeIcon icon={faAngleRight} />
          </Button>
          <Button className="pagination__button" action="tertiary" onClick={() => setPage(totalPages)} disabled={currentPage >= totalPages}>
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </Button>
        </div>

        <div className="pagination__controls">
          <label className="pagination__label">Go to page:</label>
          <input
            className="input pagination__input"
            // type="number"
            // defaultValue={pageIndex + 1}
            value={pageNumber}
            min="1"
            max={totalPages}
            onChange={(e) => {
              if(e.target.value ===""){
                setPageNumber(e.target.value)
                return
              }
              else if(isNaN(e.target.value) || e.target.value === "0") {
                  return
              }
              
              
              const page = e.target.value ? Number(e.target.value) : 0
              console.log("setpage", page)
              if (page > totalPages) {
                setPage(totalPages);
                setPageNumber(totalPages)
              }
              else {
                setPage(page)
                setPageNumber(page)
              }

             
            }}
          />
          <select
            className="select pagination__select"
            value={pageSizeBE}
            onChange={e => {
              setPageSizeBE(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          {dataTable ?
            <Button className="pagination__button pagination__button--add-row"
              action="secondary"
              disabled={disabled}
              onClick={disabled ? null : (e) => onAddRow(e)}>
              <FontAwesomeIcon icon={faPlus} /> Add Row
            </Button> : null}
        </div>
      </div>}

      {!totalPages && <div className="pagination">
        <span className="pagination__page-no">Page <b>{pageIndex + 1} of {pageOptions.length}</b></span>                   
        <div className="pagination__buttons">
          <Button className="pagination__button" action="tertiary" onClick={() => {gotoPage(0); setPageNumber(1)}} disabled={!canPreviousPage}>
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </Button>
          <Button className="pagination__button" action="tertiary" onClick={() => {previousPage(); setPageNumber(pageIndex)}} disabled={!canPreviousPage}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </Button>
          <span className="pagination__page-no--mobile-only">Page <b>{pageIndex + 1} of {pageOptions.length}</b></span>
          <Button className="pagination__button" action="tertiary" onClick={() => {nextPage(); setPageNumber(pageIndex+2)}} disabled={!canNextPage}>
            <FontAwesomeIcon icon={faAngleRight} />
          </Button>
          <Button className="pagination__button" action="tertiary" onClick={() => {gotoPage(pageCount - 1); setPageNumber(pageCount)}} disabled={!canNextPage}>
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </Button>
        </div>

        <div className="pagination__controls">
          <label className="pagination__label">Go to page:</label>
          <input
            className="input pagination__input"
            // type="number"
            // defaultValue={pageIndex + 1}
            value={pageNumber}
            onChange={e => {
              if(e.target.value ===""){
                setPageNumber(e.target.value)
                return
              }
              else if(isNaN(e.target.value) || e.target.value === "0") {
                  return
              }
              
              setPageNumber(e.target.value)
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              if (page > pageCount - 1) {
                gotoPage(pageCount - 1)
                setPageNumber(pageCount)
              }
              else {
                gotoPage(page)
              }
              
            }}
          />
          <select
            className="select pagination__select"
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          {dataTable ?
            <Button className="pagination__button pagination__button--add-row"
              action="secondary"
              disabled={disabled}
              onClick={disabled ? null : (e) => onAddRow(e)}>
              <FontAwesomeIcon icon={faPlus} /> Add Row
            </Button> : null}
        </div>
      </div>}
    </div>
  }
  </>
  )
}
