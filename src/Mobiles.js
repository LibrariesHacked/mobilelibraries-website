// React
import React, { useState } from 'react'

// Material UI
import Badge from '@material-ui/core/Badge'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import ListSubheader from '@material-ui/core/ListSubheader'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

// Material UI Styles
import { makeStyles } from '@material-ui/core/styles'

// Our components
import Filters from './Filters'
import MobileCard from './MobileCard'

import * as mobilesHelper from './helpers/mobiles'

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(1)
  },
  padding: {
    padding: theme.spacing(0, 2)
  },
  root: {
    flexGrow: 1
  }
}))

function Mobiles (props) {
  const {
    organisations, organisationLookup, organisationFilter, setOrganisationFilter,
    clearOrganisationFilter, viewStopsByOrganisation, mobiles, mobileLookup,
    mobileLocationLookup, mobilesNearestLookup, mobileFilter, setMobileFilter,
    clearMobileFilter, routes, routeLookup, routeFilter, setRouteFilter,
    clearRouteFilter, searchType, postcode, postcodeDistrict, distance, toggleGPS,
    postcodeSearch, clearSearch, setDistance, viewStop, viewStopsByMobile
  } = props
  const { openTab, setOpenTab } = useState(0)

  const changeTab = (value) => {
    setOpenTab(value)
  }

  // Get all mobiles that are currently filtered
  const filteredMobiles = mobiles.filter(mob => {
    let display = true
    if (searchType === 'gps' || searchType === 'postcode') {
      display = mobilesNearestLookup[mob.id]
    }
    if (organisationFilter.length > 0 &&
      organisationFilter.indexOf(mob.organisationId) === -1) {
      display = false
    }
    if (mobileFilter.length > 0 &&
      mobileFilter.indexOf(mob.id) === -1) {
      display = false
    }
    return display
  })
  // Then get those that are currently active
  const activeMobiles = filteredMobiles.filter(mob => {
    const status = mobilesHelper.getMobileStatus(mobileLocationLookup[mob.id])
    return (status && status.type !== 'off_road' && status.type !== 'post_route')
  })

  // Apply filters
  const displayMobiles = (openTab === 0 ? activeMobiles : filteredMobiles)

  // Calculate title
  const organisationName = (organisationFilter.length > 0 ? organisationLookup[organisationFilter[0]].name : '')

  const mobileName = (mobileFilter.length > 0 ? mobileLookup[mobileFilter[0]].name : '')

  const routeName = (routeFilter.length > 0 ? routeLookup[routeFilter[0]].name : '')

  let title = 'Mobile vans'
  // Filter stops
  if (organisationName !== '') title = 'Mobiles in ' + organisationName
  if (mobileName !== '') title = organisationName + ' ' + mobileName
  if (routeName !== '') title = organisationName + ' ' + routeName
  // Postcode search stops
  if (postcode !== '') title = 'Mobiles with stops within ' + Math.round(distance / 1609) + ' mile(s) of ' + postcode
  // GPS search stops
  if (searchType === 'gps') title = 'Mobiles with stops within ' + Math.round(distance / 1609) + ' mile(s) of your location'
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Filters
        displayStopLink
        organisations={organisations}
        organisationLookup={organisationLookup}
        organisationFilter={organisationFilter}
        setOrganisationFilter={setOrganisationFilter}
        clearOrganisationFilter={clearOrganisationFilter}
        viewStopsByOrganisation={viewStopsByOrganisation}
        mobiles={mobiles}
        mobileLookup={mobileLookup}
        mobileFilter={mobileFilter}
        setMobileFilter={setMobileFilter}
        clearMobileFilter={clearMobileFilter}
        routes={routes}
        routeLookup={routeLookup}
        routeFilter={routeFilter}
        setRouteFilter={setRouteFilter}
        clearRouteFilter={clearRouteFilter}
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
      <Tabs
        variant='standard'
        scrollButtons='off'
        value={openTab}
        indicatorColor='secondary'
        textColor='secondary'
        onChange={(e, value) => changeTab(value)}
      >
        <Tab
          className={classes.tab}
          label={
            <Badge
              className={classes.padding}
              color='secondary'
              badgeContent={activeMobiles.length}
            >
              Out today
            </Badge>
          }
        />
        <Tab
          label={
            <Badge
              showZero
              className={classes.padding}
              color='secondary'
              badgeContent={filteredMobiles.length}
            >
              All vans
            </Badge>
          }
        />
      </Tabs>
      <br />
      {mobiles
        ? (
          <Grid container spacing={3}>
            {displayMobiles
              .filter(mob => {
                let display = true
                if (organisationFilter.length > 0 &&
                  organisationFilter.indexOf(mob.organisationId) === -1) {
                  display = false
                }
                if (mobileFilter.length > 0 &&
                  mobileFilter.indexOf(mob.id) === -1) {
                  display = false
                }
                return display
              })
              .filter(mob => {
                if (searchType === 'gps' || searchType === 'postcode') {
                  return mobilesNearestLookup[mob.id]
                }
                return true
              })
              .map((mobile, idx) => {
                return (
                  <Grid
                    key={'grd_' + mobile.name.replace(' ', '') + '_' + idx}
                    item xs={12} sm={6} md={4} lg={3} xl={3}
                  >
                    <MobileCard
                      mobile={mobile}
                      location={mobileLocationLookup[mobile.id]}
                      organisation={organisationLookup[mobile.organisationId]}
                      viewStop={viewStop}
                      viewStopsByMobile={viewStopsByMobile}
                    />
                  </Grid>
                )
              })}
          </Grid>
        ) : (
          <div>
            <br />
            <LinearProgress color='secondary' />
          </div>
        )}
    </div>
  )
}

export default Mobiles
