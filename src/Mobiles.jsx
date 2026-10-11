import React, { useMemo, useState } from 'react'

import Grid2 from '@mui/material/Grid2'
import ListSubheader from '@mui/material/ListSubheader'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import { metersToMiles } from './helpers/utils'
import Search from './Search'
import MobileCard from './MobileCard'

const noResultTypography = (
  <Typography component='p' variant='body2' sx={{ textAlign: 'center', mt: 4 }}>
    No mobile libraries currently on the road.
  </Typography>
)

/**
 * Tracker page displaying a filterable grid of active and all mobile libraries.
 * @returns {JSX.Element} Mobiles page component.
 */
const Mobiles = () => {
  const [
    {
      organisationLookup,
      mobiles,
      mobileLookup,
      mobileLocationLookup,
      mobilesNearestLookup,
      routeLookup
    }
  ] = useApplicationStateValue()
  const [
    {
      organisationFilter,
      mobileFilter,
      routeFilter,
      searchType,
      searchDistance,
      searchPostcode
    }
  ] = useSearchStateValue()
  const [{ loadingMobileLocations }] = useViewStateValue()

  const [openTab, setOpenTab] = useState(0)

  const noResultsView = () =>
    !loadingMobileLocations ? noResultTypography : null

  const changeTab = value => {
    setOpenTab(value)
  }

  const mobileStatusLookup = useMemo(() => {
    const lookup = {}
    Object.keys(mobileLocationLookup).forEach(mobileId => {
      const loc = mobileLocationLookup[mobileId]
      if (loc) {
        lookup[mobileId] = loc.getStatus()
      }
    })
    return lookup
  }, [mobileLocationLookup])

  // Get all mobiles that are currently filtered
  const filteredMobiles = useMemo(() => {
    return mobiles.filter(mob => {
      let display = true
      if (searchType === 'gps' || searchType === 'postcode') {
        display = Boolean(mobilesNearestLookup[mob.id])
      }
      if (
        organisationFilter.length > 0 &&
        organisationFilter.indexOf(mob.organisationId) === -1
      ) {
        display = false
      }
      if (mobileFilter.length > 0 && mobileFilter.indexOf(mob.id) === -1) {
        display = false
      }
      return display
    })
  }, [
    mobiles,
    searchType,
    mobilesNearestLookup,
    organisationFilter,
    mobileFilter
  ])

  // Then get those that are currently active
  const activeMobiles = useMemo(() => {
    return filteredMobiles.filter(mob => {
      const loc = mobileLocationLookup[mob.id]
      return loc ? loc.isActive(mobileStatusLookup[mob.id]) : false
    })
  }, [filteredMobiles, mobileLocationLookup, mobileStatusLookup])

  const organisationName =
    organisationFilter.length > 0 && organisationLookup[organisationFilter[0]]
      ? organisationLookup[organisationFilter[0]].name
      : ''

  const mobileName =
    mobileFilter.length > 0 && mobileLookup[mobileFilter[0]]
      ? mobileLookup[mobileFilter[0]].name
      : ''

  const routeName =
    routeFilter.length > 0 && routeLookup[routeFilter[0]]
      ? routeLookup[routeFilter[0]].name
      : ''

  let title = 'Mobile libraries'
  if (organisationName !== '') {
    title = 'Mobile libraries serving ' + organisationName
  }
  if (mobileName !== '') title = organisationName + ' ' + mobileName
  if (routeName !== '') title = organisationName + ' ' + routeName
  if (searchPostcode !== '') {
    title =
      'Mobile libraries with stops within ' +
      metersToMiles(searchDistance) +
      ' mile(s) of ' +
      searchPostcode
  }
  if (searchType === 'gps') {
    title =
      'Mobile libraries with stops within ' +
      metersToMiles(searchDistance) +
      ' mile(s) of your location'
  }

  const mobilesView = openTab === 0 ? activeMobiles : filteredMobiles

  return (
    <>
      <Search />
      <ListSubheader>{title}</ListSubheader>
      <Tabs
        value={openTab}
        onChange={(e, value) => changeTab(value)}
        centered
      >
        <Tab label={`On the road (${activeMobiles.length})`} />
        <Tab label={`All (${filteredMobiles.length})`} />
      </Tabs>
      {mobilesView.length > 0
        ? (
          <Grid2 container spacing={2.5}>
            {mobilesView.map((mobile, idx) => {
              return (
                <Grid2
                  key={'grd_' + mobile.id + '_' + idx}
                  size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }}
                >
                  <MobileCard
                    mobile={mobile}
                    location={mobileLocationLookup[mobile.id]}
                    status={mobileStatusLookup[mobile.id]}
                    organisation={organisationLookup[mobile.organisationId]}
                  />
                </Grid2>
              )
            })}
          </Grid2>
          )
        : (
            noResultsView()
          )}
    </>
  )
}

export default Mobiles
