import React, { useState } from 'react'

import Badge from '@material-ui/core/Badge'
import Grid from '@material-ui/core/Grid'
import ListSubheader from '@material-ui/core/ListSubheader'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'

import { makeStyles } from '@material-ui/core/styles'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import Filters from './Filters'
import MobileCard from './MobileCard'

const useStyles = makeStyles((theme) => ({
  padding: {
    padding: theme.spacing(0, 2)
  },
  root: {
    flexGrow: 1
  }
}))

function Mobiles () {
  const [{ organisationLookup, mobiles, mobileLookup, mobileLocationLookup, mobilesNearestLookup, routes, routeLookup }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [{ organisationFilter, mobileFilter, routeFilter, searchType, searchDistance, searchPostcode }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ loadingMobileLocations }, dispatchView] = useViewStateValue() //eslint-disable-line

  const [openTab, setOpenTab] = useState(0)

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
    if (mobileLocationLookup[mob.id]) {
      const status = mobileLocationLookup[mob.id].getStatus()
      return (status && status.type !== 'offRoad' && status.type !== 'postRoute')
    }
    return null
  })

  const organisationName = (organisationFilter.length > 0 ? organisationLookup[organisationFilter[0]].name : '')

  const mobileName = (mobileFilter.length > 0 ? mobileLookup[mobileFilter[0]].name : '')

  const routeName = (routeFilter.length > 0 ? routeLookup[routeFilter[0]].name : '')

  let title = 'Mobile library vans'
  if (organisationName !== '') title = 'Mobile library vans serving ' + organisationName
  if (mobileName !== '') title = organisationName + ' ' + mobileName
  if (routeName !== '') title = organisationName + ' ' + routeName
  if (searchPostcode !== '') title = 'Mobile library vans with stops within ' + Math.round(searchDistance / 1609) + ' mile(s) of ' + searchPostcode
  if (searchType === 'gps') title = 'Mobile library vans with stops within ' + Math.round(searchDistance / 1609) + ' mile(s) of your location'

  const classes = useStyles()

  const displayMobiles = (openTab === 0 ? activeMobiles : filteredMobiles)
  const mobilesView = displayMobiles
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

  return (
    <div className={classes.root}>
      <Filters />
      <ListSubheader component='span' disableSticky>{title}</ListSubheader>
      <Tabs
        variant='standard'
        scrollButtons='off'
        value={openTab}
        indicatorColor='secondary'
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
              On the road
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
      {
        mobilesView.length > 0
          ? (
            <Grid container spacing={3}>
              {
                mobilesView.map((mobile, idx) => {
                  return (
                    <Grid
                      key={'grd_' + mobile.name.replace(' ', '') + '_' + idx}
                      item xs={12} sm={6} md={4} lg={3} xl={3}
                    >
                      <MobileCard
                        mobile={mobile}
                        location={mobileLocationLookup[mobile.id]}
                        organisation={organisationLookup[mobile.organisationId]}
                      />
                    </Grid>
                  )
                })
              }
            </Grid>) : (
            !loadingMobileLocations
              ? <Typography component='p' variant='body1'>No mobile libraries currently on the road.</Typography>
              : null
          )
      }
    </div>
  )
}

export default Mobiles
