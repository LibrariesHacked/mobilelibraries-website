// React
import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// Material UI
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'

// Material Table
import MaterialTable from 'material-table'

// Material UI Styles
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

// MUI Icons
import ArrowUpward from '@material-ui/icons/ArrowUpwardTwoTone'
import ChevronLeft from '@material-ui/icons/ChevronLeftTwoTone'
import ChevronRight from '@material-ui/icons/ChevronRightTwoTone'
import FirstPage from '@material-ui/icons/FirstPageTwoTone'
import FilterList from '@material-ui/icons/FilterListTwoTone'
import LastPage from '@material-ui/icons/LastPageTwoTone'
import MoreVertIcon from '@material-ui/icons/MoreVertTwoTone'
import EventIcon from '@material-ui/icons/EventTwoTone'
import PrintIcon from '@material-ui/icons/PrintTwoTone'
import LocationOnIcon from '@material-ui/icons/LocationOnTwoTone'

// Our components
import Filters from './Filters'

// Our Helpers
import * as stopsHelper from './helpers/stops'
import { Tooltip } from '@material-ui/core'

import { useApplicationStateValue } from './context/applicationState'

const config = require('./helpers/config.json')

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200
  },
  margin: {
    margin: theme.spacing(1)
  },
  root: {
    flexGrow: 1,
    maxWidth: '100%'
  },
  table: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    border: '1px solid #E0E0E0'
  }
}))

function usePrevious (value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

function Stops (props) {
  const {
    currentPosition, distance, viewStop, viewMapStop,
    organisationFilter, viewStopsByOrganisation,
    mobileFilter, routes, routeLookup, routeFilter, searchType, postcode,
    postcodeDistrict, toggleGPS, postcodeSearch, clearSearch, setDistance,
    setOrganisationFilter, clearOrganisationFilter, setMobileFilter, clearMobileFilter,
    setRouteFilter, clearRouteFilter
  } = props
  const [{ organisations, organisationLookup, mobiles, mobileLookup }, dispatch] = useApplicationStateValue() //eslint-disable-line

  const tableRef = React.createRef()

  const getStopCalendar = (stop) => window.open(config.api + '/stops/' + stop.id + '/ics')

  const getStopPdf = (stop) => window.open(config.api + '/stops/' + stop.id + '/pdf', '_blank')

  const prevProps = usePrevious({ currentPosition, distance })
  useEffect(() => {
    if (prevProps && (currentPosition !== prevProps.currentPosition || distance !== prevProps.distance)) tableRef.current.onQueryChange()
  }, [currentPosition, distance]) // eslint-disable-line

  const setOrgFilter = (organisationId) => {
    setOrganisationFilter(organisationId)
    tableRef.current.onQueryChange()
  }

  const clearOrgFilter = () => {
    clearOrganisationFilter()
    tableRef.current.onQueryChange()
  }

  const setMobFilter = (mobileId) => {
    setMobileFilter(mobileId)
    tableRef.current.onQueryChange()
  }

  const clearMobFilter = () => {
    clearMobileFilter()
    tableRef.current.onQueryChange()
  }

  const setRtFilter = (routeId) => {
    setRouteFilter(routeId)
    tableRef.current.onQueryChange()
  }

  const clearRtFilter = () => {
    clearRouteFilter()
    tableRef.current.onQueryChange()
  }

  const displayStopInfo = (row) => viewStop(row)

  const classes = useStyles()
  const theme = useTheme()

  // Calculate title
  const organisationName = (organisationFilter.length > 0 ? organisationLookup[organisationFilter[0]].name : '')
  const mobileName = (mobileFilter.length > 0 ? mobileLookup[mobileFilter[0]].name : '')
  const routeName = (routeFilter.length > 0 ? routeLookup[routeFilter[0]].name : '')
  let title = 'All stops'
  // Filter stops
  if (organisationName !== '') title = 'Stops in ' + organisationName
  if (mobileName !== '') title = 'Stops for ' + organisationName + ' ' + mobileName
  if (routeName !== '') title = 'Stops for ' + organisationName + ' ' + routeName
  // Postcode search stops
  if (postcode !== '') title = 'Stops within ' + Math.round(distance / 1609) + ' mile(s) of ' + postcode
  // GPS search stops
  if (searchType === 'gps') title = 'Stops within ' + Math.round(distance / 1609) + ' mile(s) of your location'

  const orgText = {}
  Object.keys(organisationLookup).forEach(key => {
    orgText[key] = organisationLookup[key].name
  })
  const mobileText = {}
  Object.keys(mobileLookup).forEach(key => {
    mobileText[key] = mobileLookup[key].name
  })
  const routeText = {}
  Object.keys(routeLookup).forEach(key => {
    routeText[key] = routeLookup[key].name
  })

  return (
    <div style={{ maxWidth: '100%' }}>
      <Filters
        displayStopLink={false}
        organisations={organisations}
        organisationLookup={organisationLookup}
        organisationFilter={organisationFilter}
        setOrganisationFilter={setOrgFilter}
        clearOrganisationFilter={clearOrgFilter}
        viewStopsByOrganisation={viewStopsByOrganisation}
        mobiles={mobiles}
        mobileLookup={mobileLookup}
        mobileFilter={mobileFilter}
        setMobileFilter={setMobFilter}
        clearMobileFilter={clearMobFilter}
        routes={routes}
        routeLookup={routeLookup}
        routeFilter={routeFilter}
        setRouteFilter={setRtFilter}
        clearRouteFilter={clearRtFilter}
        postcode={postcode}
        postcodeDistrict={postcodeDistrict}
        distance={distance}
        searchType={searchType}
        setDistance={setDistance}
        toggleGPS={toggleGPS}
        postcodeSearch={postcodeSearch}
        clearSearch={clearSearch}
      />
      <ListSubheader disableSticky>{title}</ListSubheader>
      <MaterialTable
        tableRef={tableRef}
        components={{
          Container: props => <Paper {...props} elevation={0} className={classes.table} />
        }}
        icons={{
          Filter: FilterList,
          FirstPage: FirstPage,
          LastPage: LastPage,
          NextPage: ChevronRight,
          PreviousPage: ChevronLeft,
          SortArrow: ArrowUpward
        }}
        options={{
          padding: useMediaQuery(theme.breakpoints.up('sm')) ? 'default' : 'dense',
          search: false,
          loadingType: 'overlay',
          actionsColumnIndex: 0,
          filtering: false,
          toolbar: false,
          headerStyle: {
            backgroundColor: '#fafafa',
            color: '#737373',
            border: '0px'
          }
        }}
        columns={[
          {
            title: '',
            field: 'name',
            filtering: false,
            render: rowData => {
              return (
                <>
                  <Tooltip title='See more stop details'>
                    <IconButton onClick={() => displayStopInfo(rowData)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                  <Hidden mdDown>
                    <Tooltip title='Add event to your device calendar'>
                      <IconButton onClick={() => getStopCalendar(rowData)}>
                        <EventIcon />
                      </IconButton>
                    </Tooltip>
                  </Hidden>
                  <Hidden mdDown>
                    <Tooltip title='Download a PDF timetable for this stop'>
                      <IconButton onClick={() => getStopPdf(rowData)}>
                        <PrintIcon />
                      </IconButton>
                    </Tooltip>
                  </Hidden>
                  <Hidden mdDown>
                    <Tooltip title='See this stop on the map'>
                      <IconButton onClick={() => viewMapStop(rowData.longitude, rowData.latitude)} component={Link} to='/map'>
                        <LocationOnIcon />
                      </IconButton>
                    </Tooltip>
                  </Hidden>
                </>
              )
            },
            cellStyle: {
              borderBottom: '1px solid #f5f5f5',
              backgroundColor: '#ffffff'
            }
          },
          {
            title: 'Name',
            field: 'name',
            filtering: false,
            hidden: false,
            render: rowData => {
              return (
                rowData.name
              )
            },
            cellStyle: {
              borderBottom: '1px solid #f5f5f5',
              backgroundColor: '#ffffff'
            }
          },
          {
            title: 'Community',
            field: 'community',
            filtering: false,
            cellStyle: {
              borderBottom: '1px solid #f5f5f5',
              backgroundColor: '#ffffff'
            }
          },
          {
            title: 'Library service',
            field: 'organisationName',
            filtering: false,
            hidden: useMediaQuery(theme.breakpoints.down('sm')),
            cellStyle: {
              borderBottom: '1px solid #f5f5f5',
              backgroundColor: '#ffffff'
            }
          },
          {
            title: 'Next due',
            field: 'routeSchedule',
            filtering: false,
            hidden: useMediaQuery(theme.breakpoints.down('xs')),
            render: (rowData) => {
              return (
                rowData.routeSchedule.length > 0 ? rowData.routeSchedule[0].format('Do MMMM h:mma') : ''
              )
            },
            cellStyle: {
              borderBottom: '1px solid #f5f5f5',
              backgroundColor: '#ffffff'
            }
          }
        ]}
        data={query =>
          new Promise((resolve, reject) => {
            async function getStops () {
              const stopData = await stopsHelper.getQueryStops(query, organisationFilter, mobileFilter, routeFilter, currentPosition, distance)
              resolve({
                data: stopData.stops,
                page: (stopData.page - 1),
                totalCount: stopData.total
              })
            }
            getStops()
          })}
      />
    </div>
  )
}

export default Stops
