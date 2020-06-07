// React
import React, { useState } from 'react'

// Material UI
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import ListSubheader from '@material-ui/core/ListSubheader'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

// MUI Icons
import BusinessIcon from '@material-ui/icons/BusinessTwoTone'
import DirectionBusIcon from '@material-ui/icons/DirectionsBusTwoTone'
import DirectionsIcon from '@material-ui/icons/DirectionsTwoTone'

// Material UI Styles
import { makeStyles } from '@material-ui/core/styles'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'

// Our components
import PostcodeSearch from './PostcodeSearch'

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1)
  },
  chip: {
    marginRight: theme.spacing(1)
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  search: {
    alignContent: 'center',
    textAlign: 'center',
    display: 'table',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '10px'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: '5px'
  },
  title: {
    textAlign: 'center'
  }
}))

function Filters () {
  const [{ organisations, organisationLookup, mobiles, mobileLookup, routeLookup, routes }] = useApplicationStateValue()
  const [{ distance, organisationFilter, mobileFilter, routeFilter }, dispatchSearch] = useSearchStateValue()

  const [organisationMenuAnchor, setOrganisationMenuAnchor] = useState(null)
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null)
  const [routeMenuAnchor, setRouteMenuAnchor] = useState(null)

  const openOrganisationMenu = (element) => setOrganisationMenuAnchor(element)

  const closeOrganisationMenu = () => setOrganisationMenuAnchor(null)

  const chooseOrganisation = (organisationId) => {
    dispatchSearch('FilterByOrganisation', { organisationId: organisationId })
    closeOrganisationMenu()
  }

  const clearOrganisationFilter = () => {
    dispatchSearch('ClearFilters')
  }

  const openMobileMenu = (element) => setMobileMenuAnchor(element)

  const closeMobileMenu = () => setMobileMenuAnchor(null)

  const chooseMobile = (organisationId, mobileId) => {
    dispatchSearch('FilterByMobile', { organisationId: organisationId, mobileId: mobileId })
    closeMobileMenu()
  }

  const clearMobileFilter = () => {
    dispatchSearch('ClearMobileFilter')
  }

  const openRouteMenu = (element) => setRouteMenuAnchor(element)

  const closeRouteMenu = () => setRouteMenuAnchor(null)

  const chooseRoute = (organisationId, mobileId, routeId) => {
    dispatchSearch('FilterByRoute', { routeId: routeId })
    closeRouteMenu()
  }

  const clearRouteFilter = () => {
    dispatchSearch('ClearRouteFilter')
  }

  const countries = new Set(organisations.map(org => org.country))

  const classes = useStyles()

  return (
    <>
      <Typography component='h2' variant='h6' color='secondary' className={classes.title}>Your mobile service</Typography>
      <Typography component='p' variant='body1' color='secondary' className={classes.subtitle}>Find services within {distance / 1609} mile(s)</Typography>
      <div className={classes.search}>
        <PostcodeSearch />
      </div>
      <Typography component='p' variant='body1' color='secondary' className={classes.subtitle}>Or, choose your library service</Typography>
      <div className={classes.search}>
        {organisationFilter.length === 0 ? (
          <Tooltip title='Choose library service'>
            <Button color='secondary' className={classes.button} onClick={(e) => openOrganisationMenu(e.currentTarget)}>
              <BusinessIcon className={classes.leftIcon} />Select service
            </Button>
          </Tooltip>
        ) : <Chip className={classes.chip} color='primary' variant='outlined' onDelete={clearOrganisationFilter} label={organisationLookup[organisationFilter[0]].name} />}
        {organisationFilter.length > 0
          ? (mobileFilter.length === 0
            ? (
              <Tooltip title='Choose mobile library'>
                <Button color='secondary' className={classes.button} onClick={(e) => openMobileMenu(e.currentTarget)}>
                  <DirectionBusIcon className={classes.leftIcon} />Select mobile
                </Button>
              </Tooltip>
            ) : <Chip className={classes.chip} color='primary' variant='outlined' onDelete={clearMobileFilter} label={mobileLookup[mobileFilter[0]].name} />
          ) : null}
        {mobileFilter.length > 0
          ? (routeFilter.length === 0
            ? (
              <Tooltip title='Choose route'>
                <Button color='secondary' className={classes.button} onClick={(e) => openRouteMenu(e.currentTarget)}>
                  <DirectionsIcon className={classes.leftIcon} />Select route
                </Button>
              </Tooltip>
            ) : <Chip className={classes.chip} color='primary' variant='outlined' onDelete={clearRouteFilter} label={routeLookup[routeFilter[0]].name} />
          )
          : null}
      </div>
      <Menu
        id='menu-library-service'
        anchorEl={organisationMenuAnchor}
        keepMounted
        open={Boolean(organisationMenuAnchor)}
        onClose={() => closeOrganisationMenu()}
      >
        {
          Array.from(countries)
            .sort((a, b) => a.localeCompare(b))
            .map((country, idx) => {
              const menuItems = [<ListSubheader key={'lst_' + idx} disableSticky>{country}</ListSubheader>]
              const orgList = organisations
                .sort((a, b) => a.name.localeCompare(b.name))
                .filter(org => org.country === country)
                .map(org => {
                  return <MenuItem key={'mnu_itm_org_' + org.id} onClick={() => chooseOrganisation(org.id)}>{org.name}</MenuItem>
                })
              return menuItems.concat(orgList)
            })
        }
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
            if (organisationFilter.length > 0 &&
              organisationFilter.indexOf(mob.organisationId) === -1) {
              display = false
            }
            return display
          })
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(mob => {
            return <MenuItem key={'mnu_itm_mob_' + mob.id} onClick={() => chooseMobile(mob.organisationId, mob.id)}>{mob.name}</MenuItem>
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
            if (mobileFilter.length > 0 &&
              mobileFilter.indexOf(route.mobileId) === -1) {
              display = false
            }
            return display
          })
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(route => {
            return <MenuItem key={'mnu_itm_route_' + route.id} onClick={() => chooseRoute(route.organisationId, route.mobileId, route.id)}>{route.name}</MenuItem>
          })}
      </Menu>
    </>
  )
}

export default Filters
