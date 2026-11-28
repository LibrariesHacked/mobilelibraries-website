import React, { useCallback, useMemo, useState } from 'react'

import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import ListSubheader from '@mui/material/ListSubheader'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'

import BusinessIcon from '@mui/icons-material/BusinessRounded'
import DirectionBusIcon from '@mui/icons-material/DirectionsBusRounded'
import DirectionsIcon from '@mui/icons-material/DirectionsRounded'
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import { createLookup } from './helpers/utils'
import * as localAuthoritiesModel from './models/localAuthorities'
import * as mobilesModel from './models/mobiles'
import * as routesModel from './models/routes'

const ActiveFilterChip = ({ label, onDelete }) => (
  <Chip onDelete={onDelete} label={label} sx={{ minHeight: 36 }} />
)

/**
 * Full-width aligned cascading filter controls allowing users to filter by
 * local library authority, mobile library vehicle, and route.
 *
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
    },
    dispatchApplication
  ] = useApplicationStateValue()
  const [{ localAuthorityFilter, mobileFilter, routeFilter }, dispatchSearch] =
    useSearchStateValue()
  const [, dispatchView] = useViewStateValue()

  const [localAuthorityMenuAnchor, setLocalAuthorityMenuAnchor] = useState(null)
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null)
  const [routeMenuAnchor, setRouteMenuAnchor] = useState(null)
  const [reloadingServices, setReloadingServices] = useState(false)

  const handleOpenLocalAuthorityMenu = async event => {
    setLocalAuthorityMenuAnchor(event.currentTarget)
    if (localAuthorities.length === 0 && !reloadingServices) {
      setReloadingServices(true)
      try {
        const [freshAuthorities, freshMobiles, freshRoutes, freshLocations] =
          await Promise.all([
            localAuthoritiesModel.getAllLocalAuthorities(),
            mobilesModel.getAllMobiles(),
            routesModel.getAllRoutes(),
            mobilesModel.getMobileLocations()
          ])
        if (freshAuthorities.length > 0) {
          dispatchApplication({
            type: 'InitializeApplicationData',
            localAuthorities: freshAuthorities,
            localAuthorityLookup: createLookup(freshAuthorities),
            mobiles: freshMobiles,
            mobileLookup: createLookup(freshMobiles),
            routes: freshRoutes,
            routeLookup: createLookup(freshRoutes),
            mobileLocations: freshLocations,
            mobileLocationLookup: createLookup(freshLocations, 'mobileId')
          })
        }
      } finally {
        setReloadingServices(false)
      }
    }
  }

  const chooseLocalAuthority = useCallback(
    localAuthorityId => {
      dispatchSearch({ type: 'FilterByLocalAuthority', localAuthorityId })
      setLocalAuthorityMenuAnchor(null)
    },
    [dispatchSearch]
  )

  const chooseMobile = (localAuthorityId, mobileId) => {
    dispatchSearch({ type: 'FilterByMobile', localAuthorityId, mobileId })
    dispatchView({
      type: 'SetMobileLibraryDialog',
      mobileLibraryDialogOpen: false
    })
    setMobileMenuAnchor(null)
  }

  const chooseRoute = routeId => {
    dispatchSearch({ type: 'FilterByRoute', routeId })
    setRouteMenuAnchor(null)
  }

  const localAuthorityMenuItems = useMemo(() => {
    const countries = Array.from(
      new Set(localAuthorities.map(la => la.country || 'United Kingdom'))
    ).sort((a, b) => a.localeCompare(b))

    return countries.flatMap((country, idx) => {
      const laList = localAuthorities.filter(
        la => (la.country || 'United Kingdom') === country
      )
      return [
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
    })
  }, [localAuthorities, chooseLocalAuthority])

  const filteredMobiles = useMemo(() => {
    if (localAuthorityFilter.length === 0) return mobiles
    return mobiles.filter(mob =>
      localAuthorityFilter.includes(mob.localAuthorityId)
    )
  }, [mobiles, localAuthorityFilter])

  const filteredRoutes = useMemo(() => {
    if (mobileFilter.length === 0) return routes
    return routes.filter(route =>
      mobileFilter.includes(route.mobileId)
    )
  }, [routes, mobileFilter])

  return (
    <>
      <Stack
        direction='row'
        spacing={1}
        useFlexGap
        sx={{
          width: '100%',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        {localAuthorityFilter.length === 0
          ? (
            <Button
              id='filter-local-authority-button'
              aria-controls={
                localAuthorityMenuAnchor ? 'menu-library-service' : undefined
              }
              aria-expanded={Boolean(localAuthorityMenuAnchor)}
              aria-haspopup='menu'
              variant='outlined'
              fullWidth
              onClick={handleOpenLocalAuthorityMenu}
              startIcon={<BusinessIcon />}
              endIcon={
                reloadingServices
                  ? <CircularProgress size={16} color='inherit' />
                  : <ExpandMoreIcon />
              }
              sx={{ justifyContent: 'space-between', py: 1 }}
            >
              Select library service
            </Button>
            )
          : (
            <ActiveFilterChip
              onDelete={() => dispatchSearch({ type: 'ClearAll' })}
              label={localAuthorityLookup[localAuthorityFilter[0]]?.name}
            />
            )}

        {localAuthorityFilter.length > 0 &&
          (mobileFilter.length === 0
            ? (
              <Button
                id='filter-mobile-button'
                aria-controls={
                  mobileMenuAnchor ? 'menu-mobile-library' : undefined
                }
                aria-expanded={Boolean(mobileMenuAnchor)}
                aria-haspopup='menu'
                variant='outlined'
                size='small'
                onClick={e => setMobileMenuAnchor(e.currentTarget)}
                startIcon={<DirectionBusIcon />}
                endIcon={<ExpandMoreIcon />}
                sx={{ minHeight: 36 }}
              >
                Select mobile
              </Button>
              )
            : (
              <ActiveFilterChip
                onDelete={() => dispatchSearch({ type: 'ClearMobileFilter' })}
                label={mobileLookup[mobileFilter[0]]?.name}
              />
              ))}

        {mobileFilter.length > 0 &&
          (routeFilter.length === 0
            ? (
              <Button
                id='filter-route-button'
                aria-controls={routeMenuAnchor ? 'menu-route' : undefined}
                aria-expanded={Boolean(routeMenuAnchor)}
                aria-haspopup='menu'
                variant='outlined'
                size='small'
                onClick={e => setRouteMenuAnchor(e.currentTarget)}
                startIcon={<DirectionsIcon />}
                endIcon={<ExpandMoreIcon />}
                sx={{ minHeight: 36 }}
              >
                Select route
              </Button>
              )
            : (
              <ActiveFilterChip
                onDelete={() => dispatchSearch({ type: 'ClearRouteFilter' })}
                label={routeLookup[routeFilter[0]]?.name}
              />
              ))}
      </Stack>

      <Menu
        id='menu-library-service'
        aria-labelledby='filter-local-authority-button'
        anchorEl={localAuthorityMenuAnchor}
        open={Boolean(localAuthorityMenuAnchor)}
        onClose={() => setLocalAuthorityMenuAnchor(null)}
        slotProps={{
          paper: {
            elevation: 0,
            sx: { maxHeight: 360, minWidth: 260 }
          }
        }}
      >
        {localAuthorityMenuItems.length > 0
          ? localAuthorityMenuItems
          : (
            <MenuItem disabled>
              {reloadingServices
                ? 'Loading library services…'
                : 'Library services temporarily unavailable'}
            </MenuItem>
            )}
      </Menu>

      <Menu
        id='menu-mobile-library'
        aria-labelledby='filter-mobile-button'
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={() => setMobileMenuAnchor(null)}
        slotProps={{
          paper: {
            elevation: 0,
            sx: { maxHeight: 360, minWidth: 220 }
          }
        }}
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
        onClose={() => setRouteMenuAnchor(null)}
        slotProps={{
          paper: {
            elevation: 0,
            sx: { maxHeight: 360, minWidth: 220 }
          }
        }}
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
