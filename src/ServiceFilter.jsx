import React, { useState } from 'react'

import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import ListSubheader from '@mui/material/ListSubheader'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'

import BusinessIcon from '@mui/icons-material/BusinessTwoTone'
import DirectionBusIcon from '@mui/icons-material/DirectionsBusTwoTone'
import DirectionsIcon from '@mui/icons-material/DirectionsTwoTone'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'

const Filters = () => {
  const [
    {
      organisations,
      organisationLookup,
      mobiles,
      mobileLookup,
      routeLookup,
      routes
    }
  ] = useApplicationStateValue()
  const [{ organisationFilter, mobileFilter, routeFilter }, dispatchSearch] =
    useSearchStateValue()

  const [organisationMenuAnchor, setOrganisationMenuAnchor] = useState(null)
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null)
  const [routeMenuAnchor, setRouteMenuAnchor] = useState(null)

  const openOrganisationMenu = element => setOrganisationMenuAnchor(element)

  const closeOrganisationMenu = () => setOrganisationMenuAnchor(null)

  const chooseOrganisation = organisationId => {
    dispatchSearch({
      type: 'FilterByOrganisation',
      organisationId: organisationId
    })
    closeOrganisationMenu()
  }

  const clearOrganisationFilter = () => {
    dispatchSearch({ type: 'ClearAll' })
  }

  const openMobileMenu = element => setMobileMenuAnchor(element)

  const closeMobileMenu = () => setMobileMenuAnchor(null)

  const chooseMobile = (organisationId, mobileId) => {
    dispatchSearch({
      type: 'FilterByMobile',
      organisationId: organisationId,
      mobileId: mobileId
    })
    closeMobileMenu()
  }

  const clearMobileFilter = () => {
    dispatchSearch({ type: 'ClearMobileFilter' })
  }

  const openRouteMenu = element => setRouteMenuAnchor(element)

  const closeRouteMenu = () => setRouteMenuAnchor(null)

  const chooseRoute = routeId => {
    dispatchSearch({ type: 'FilterByRoute', routeId: routeId })
    closeRouteMenu()
  }

  const clearRouteFilter = () => {
    dispatchSearch({ type: 'ClearRouteFilter' })
  }

  const countries = new Set(organisations.map(org => org.country))

  return (
    <>
      {organisationFilter.length === 0 ? (
        <Tooltip title='Choose library authority'>
          <Button
            color='primary'
            onClick={e => openOrganisationMenu(e.currentTarget)}
          >
            <BusinessIcon />
            Select service
          </Button>
        </Tooltip>
      ) : (
        <Chip
          color='primary'
          variant='outlined'
          onDelete={clearOrganisationFilter}
          label={organisationLookup[organisationFilter[0]].name}
          sx={{ mr: 1 }}
        />
      )}
      {organisationFilter.length > 0 ? (
        mobileFilter.length === 0 ? (
          <Tooltip title='Choose mobile library'>
            <Button
              color='primary'
              onClick={e => openMobileMenu(e.currentTarget)}
            >
              <DirectionBusIcon />
              Select mobile
            </Button>
          </Tooltip>
        ) : (
          <Chip
            color='primary'
            variant='outlined'
            onDelete={clearMobileFilter}
            label={mobileLookup[mobileFilter[0]].name}
            sx={{ mr: 1 }}
          />
        )
      ) : null}
      {mobileFilter.length > 0 ? (
        routeFilter.length === 0 ? (
          <Tooltip title='Choose route'>
            <Button
              color='primary'
              onClick={e => openRouteMenu(e.currentTarget)}
            >
              <DirectionsIcon />
              Select route
            </Button>
          </Tooltip>
        ) : (
          <Chip
            color='primary'
            variant='outlined'
            onDelete={clearRouteFilter}
            label={routeLookup[routeFilter[0]].name}
            sx={{ mr: 1 }}
          />
        )
      ) : null}
      <Menu
        id='menu-library-service'
        anchorEl={organisationMenuAnchor}
        keepMounted
        open={Boolean(organisationMenuAnchor)}
        onClose={() => closeOrganisationMenu()}
      >
        {Array.from(countries)
          .sort((a, b) => a.localeCompare(b))
          .map((country, idx) => {
            const menuItems = [
              <ListSubheader key={'lst_' + idx} disableSticky>
                {country}
              </ListSubheader>
            ]
            const orgList = organisations
              .sort((a, b) => a.name.localeCompare(b.name))
              .filter(org => org.country === country)
              .map(org => {
                return (
                  <MenuItem
                    key={'mnu_itm_org_' + org.id}
                    onClick={() => chooseOrganisation(org.id)}
                  >
                    {org.name}
                  </MenuItem>
                )
              })
            return menuItems.concat(orgList)
          })}
      </Menu>
      <Menu
        id='menu-mobile-library'
        anchorEl={mobileMenuAnchor}
        keepMounted
        open={Boolean(mobileMenuAnchor)}
        onClose={() => closeMobileMenu()}
      >
        {mobiles
          .filter(mob => {
            let display = true
            if (
              organisationFilter.length > 0 &&
              organisationFilter.indexOf(mob.organisationId) === -1
            ) {
              display = false
            }
            return display
          })
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(mob => {
            return (
              <MenuItem
                key={'mnu_itm_mob_' + mob.id}
                onClick={() => chooseMobile(mob.organisationId, mob.id)}
              >
                {mob.name}
              </MenuItem>
            )
          })}
      </Menu>
      <Menu
        id='menu-route'
        anchorEl={routeMenuAnchor}
        keepMounted
        open={Boolean(routeMenuAnchor)}
        onClose={() => closeRouteMenu()}
      >
        {routes
          .filter(route => {
            let display = true
            if (
              mobileFilter.length > 0 &&
              mobileFilter.indexOf(route.mobileId) === -1
            ) {
              display = false
            }
            return display
          })
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(route => {
            return (
              <MenuItem
                key={'mnu_itm_route_' + route.id}
                onClick={() => chooseRoute(route.id)}
              >
                {route.name}
              </MenuItem>
            )
          })}
      </Menu>
    </>
  )
}

export default Filters
