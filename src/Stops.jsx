import React, { useEffect, useState, useCallback, useMemo } from 'react'

import { useTheme } from '@mui/material/styles'

import useMediaQuery from '@mui/material/useMediaQuery'

import ListSubheader from '@mui/material/ListSubheader'

import InfoIcon from '@mui/icons-material/InfoOutlined'

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import useMobileStopsQuery from './hooks/useMobileStopsQuery'
import usePrevious from './hooks/usePrevious'

const Stops = () => {
  const [
    {
      searchDistance,
      searchPosition,
      organisationFilter,
      mobileFilter,
      routeFilter
    },
    dispatchSearch
  ] = useSearchStateValue() //eslint-disable-line
  const [{}, dispatchView] = useViewStateValue() //eslint-disable-line

  const theme = useTheme()
  const prevPosition = usePrevious(searchPosition)

  const initialSortModel = [{ field: 'name', sort: 'asc' }]
  const [sortModel, setSortModel] = useState(initialSortModel)
  const [filterModel, setFilterModel] = useState({
    items: [
      {
        field: 'localAuthority',
        operator: 'contains',
        value: ''
      }
    ]
  })
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5
  })

  const { loadingMobileStops, mobileStops, pageInfo, getMobileStopsFromQuery } =
    useMobileStopsQuery()

  const fetchStops = useCallback(() => {
    if (
      prevPosition &&
      prevPosition.length === 0 &&
      searchPosition.length > 0 &&
      sortModel[0].field !== 'distance'
    ) {
      setSortModel([{ field: 'distance', sort: 'asc' }])
      return
    }
    if (sortModel[0].field === 'distance' && searchPosition.length === 0) {
      setSortModel(initialSortModel)
      return
    }
    getMobileStopsFromQuery({
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
      sortModel,
      searchPosition,
      searchDistance,
      organisationFilter,
      mobileFilter,
      routeFilter
    })
  }, [
    paginationModel,
    sortModel,
    searchPosition,
    searchDistance,
    organisationFilter,
    mobileFilter,
    routeFilter
  ])

  useEffect(() => fetchStops(), [fetchStops])

  const selectStop = useCallback(
    stop => {
      dispatchSearch({ type: 'SetCurrentStop', currentStopId: stop.id })
      dispatchView({ type: 'SetStopDialog', stopDialogOpen: true })
    },
    [dispatchSearch, dispatchView]
  )

  const columns = useMemo(
    () => [
      { field: 'community', headerName: 'Community', flex: 1 },
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'organisationName', headerName: 'Library service', flex: 1 },
      {
        field: 'distance',
        headerName: 'Distance',
        flex: 1,
        valueFormatter: value => {
          if (value == null) return ''
          const valueFormatted = Math.round(Number(value / 1609))
          return `${valueFormatted} mi`
        }
      },
      {
        field: 'actions',
        type: 'actions',
        getActions: params => [
          <GridActionsCellItem
            key={`act_${params.id}`}
            icon={<InfoIcon />}
            onClick={() => selectStop(params.row)}
            label='Show more stop information'
          />
        ],
        width: 50
      }
    ],
    [selectStop]
  )

  const rowCountRef = React.useRef(pageInfo?.totalRowCount || 0)

  const rowCount = React.useMemo(() => {
    if (pageInfo?.totalRowCount !== undefined) {
      rowCountRef.current = pageInfo.totalRowCount
    }
    return rowCountRef.current
  }, [pageInfo?.totalRowCount])

  return (
    <>
      <ListSubheader disableSticky disableGutters sx={{ textAlign: 'center' }}>
        Stops
      </ListSubheader>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1, width: '100%' }}>
          <DataGrid
            columnVisibilityModel={{
              community: true,
              name: useMediaQuery(theme.breakpoints.up('sm')),
              organisationName: useMediaQuery(theme.breakpoints.up('md')),
              distance: searchPosition.length > 0
            }}
            density='standard'
            disableRowSelectionOnClick
            filterMode='server'
            filterModel={filterModel}
            loading={loadingMobileStops}
            pageSizeOptions={[5]}
            pagination
            paginationMode='server'
            paginationModel={paginationModel}
            onPaginationModelChange={newPaginationModel => {
              setPaginationModel(newPaginationModel)
            }}
            rows={mobileStops}
            rowCount={rowCount}
            sortingMode='server'
            sortModel={sortModel}
            onFilterModelChange={newFilterModel => {
              setFilterModel(newFilterModel)
            }}
            onSortModelChange={newSortModel => {
              if (newSortModel.length === 0) {
                setSortModel(initialSortModel)
              } else {
                setSortModel(newSortModel)
              }
            }}
            onRowClick={params => selectStop(params.row)}
            columns={columns}
          />
        </div>
      </div>
    </>
  )
}

export default Stops
