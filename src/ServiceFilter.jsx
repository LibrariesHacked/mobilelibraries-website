import React, { useMemo, useState } from 'react'

import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import ListSubheader from '@mui/material/ListSubheader'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'

import BusinessIcon from '@mui/icons-material/BusinessTwoTone'
import DirectionBusIcon from '@mui/icons-material/DirectionsBusTwoTone'
import DirectionsIcon from '@mui/icons-material/DirectionsTwoTone'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'

/**
 * Cascading filter controls allowing users to filter by local library authority, mobile library, and route.
 * @returns {JSX.Element} Filters component.
 */
const Filters = () => {
  const [
    {
      localAuthorities,
      localAuthorityLookup,
      mobiles,
      mobileLookup,
      routeLookup,
      routes
    }
  ] = useApplicationStateValue()
  const [{ localAuthorityFilter, mobileFilter, routeFilter }, dispatchSearch] =
    useSearchStateValue()

  const [localAuthorityMenuAnchor, setLocalAuthorityMenuAnchor] = useState(null)
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null)
  const [routeMenuAnchor, setRouteMenuAnchor] = useState(null)

  const openLocalAuthorityMenu = element => setLocalAuthorityMenuAnchor(element)

  const closeLocalAuthorityMenu = () => setLocalAuthorityMenuAnchor(null)

  const chooseLocalAuthority = localAuthorityId => {
    dispatchSearch({
      type: 'FilterByLocalAuthority',
      localAuthorityId
    })
    closeLocalAuthorityMenu()
  }

  const clearLocalAuthorityFilter = () => {
    dispatchSearch({ type: 'ClearAll' })
  }

  const openMobileMenu = element => setMobileMenuAnchor(element)

  const closeMobileMenu = () => setMobileMenuAnchor(null)

  const chooseMobile = (localAuthorityId, mobileId) => {
    dispatchSearch({
      type: 'FilterByMobile',
      localAuthorityId,
      mobileId
    })
    closeMobileMenu()
  }

  const clearMobileFilter = () => {
    dispatchSearch({ type: 'ClearMobileFilter' })
  }

  const openRouteMenu = element => setRouteMenuAnchor(element)

  const closeRouteMenu = () => setRouteMenuAnchor(null)

  const chooseRoute = routeId => {
    dispatchSearch({ type: 'FilterByRoute', routeId })
    closeRouteMenu()
  }

  const clearRouteFilter = () => {
    dispatchSearch({ type: 'ClearRouteFilter' })
  }

  const localAuthoritiesByCountry = useMemo(() => {
    const countries = Array.from(
      new Set(localAuthorities.map(la => la.country))
    ).sort((a, b) => a.localeCompare(b))
    const sortedAuthorities = [...localAuthorities].sort((a, b) =>
      a.name.localeCompare(b.name)
    )
    return countries.map(country => ({
      country,
      localAuthorities: sortedAuthorities.filter(la => la.country === country)
    }))
  }, [localAuthorities])

  const filteredMobiles = useMemo(() => {
    return mobiles
      .filter(
        mob =>
          localAuthorityFilter.length === 0 ||
          localAuthorityFilter.indexOf(mob.localAuthorityId) !== -1
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [mobiles, localAuthorityFilter])

  const filteredRoutes = useMemo(() => {
    return routes
      .filter(
        route =>
          mobileFilter.length === 0 ||
          mobileFilter.indexOf(route.mobileId) !== -1
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [routes, mobileFilter])

  return (
    <>
      <Stack
        direction='row'
        spacing={1.5}
        useFlexGap
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        {localAuthorityFilter.length === 0
          ? (
            <Tooltip title='Choose library service' describeChild>
              <Button
                id='filter-local-authority-button'
                aria-controls={
                  localAuthorityMenuAnchor ? 'menu-library-service' : undefined
                }
                aria-expanded={Boolean(localAuthorityMenuAnchor)}
                aria-haspopup='menu'
                size='large'
                onClick={e => openLocalAuthorityMenu(e.currentTarget)}
                startIcon={<BusinessIcon />}
              >
                Select service
              </Button>
            </Tooltip>
            )
          : (
            <Chip
              onDelete={clearLocalAuthorityFilter}
              label={localAuthorityLookup[localAuthorityFilter[0]]?.name}
            />
            )}
        {localAuthorityFilter.length > 0
          ? (
              mobileFilter.length === 0
                ? (
                  <Tooltip title='Choose mobile library' describeChild>
                    <Button
                      id='filter-mobile-button'
                      aria-controls={
                        mobileMenuAnchor ? 'menu-mobile-library' : undefined
                      }
                      aria-expanded={Boolean(mobileMenuAnchor)}
                      aria-haspopup='menu'
                      size='large'
                      onClick={e => openMobileMenu(e.currentTarget)}
                      startIcon={<DirectionBusIcon />}
                    >
                      Select mobile
                    </Button>
                  </Tooltip>
                  )
                : (
                  <Chip
                    onDelete={clearMobileFilter}
                    label={mobileLookup[mobileFilter[0]]?.name}
                  />
                  )
            )
          : null}
        {mobileFilter.length > 0
          ? (
              routeFilter.length === 0
                ? (
                  <Tooltip title='Choose route' describeChild>
                    <Button
                      id='filter-route-button'
                      aria-controls={routeMenuAnchor ? 'menu-route' : undefined}
                      aria-expanded={Boolean(routeMenuAnchor)}
                      aria-haspopup='menu'
                      size='large'
                      onClick={e => openRouteMenu(e.currentTarget)}
                      startIcon={<DirectionsIcon />}
                    >
                      Select route
                    </Button>
                  </Tooltip>
                  )
                : (
                  <Chip
                    onDelete={clearRouteFilter}
                    label={routeLookup[routeFilter[0]]?.name}
                  />
                  )
            )
          : null}
      </Stack>
      <Menu
        id='menu-library-service'
        aria-labelledby='filter-local-authority-button'
        anchorEl={localAuthorityMenuAnchor}
        open={Boolean(localAuthorityMenuAnchor)}
        onClose={closeLocalAuthorityMenu}
      >
        {localAuthoritiesByCountry.map(
          ({ country, localAuthorities: laList }, idx) => [
            <ListSubheader key={'lst_' + idx}>{country}</ListSubheader>,
            ...laList.map(la => (
              <MenuItem
                key={'mnu_itm_la_' + la.id}
                onClick={() => chooseLocalAuthority(la.id)}
              >
                {la.name}
              </MenuItem>
            ))
          ]
        )}
      </Menu>
      <Menu
        id='menu-mobile-library'
        aria-labelledby='filter-mobile-button'
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={closeMobileMenu}
      >
        {filteredMobiles.map(mob => (
          <MenuItem
            key={'mnu_itm_mob_' + mob.id}
            onClick={() => chooseMobile(mob.localAuthorityId, mob.id)}
          >
            {mob.name}
          </MenuItem>
        ))}
      </Menu>
      <Menu
        id='menu-route'
        aria-labelledby='filter-route-button'
        anchorEl={routeMenuAnchor}
        open={Boolean(routeMenuAnchor)}
        onClose={closeRouteMenu}
      >
        {filteredRoutes.map(route => (
          <MenuItem
            key={'mnu_itm_route_' + route.id}
            onClick={() => chooseRoute(route.id)}
          >
            {route.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default Filters
