import React, { useState } from 'react'

import { Link, useLocation } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import WidgetsIcon from '@material-ui/icons/WidgetsTwoTone'
import DirectionBusIcon from '@material-ui/icons/DirectionsBusTwoTone'
import HomeIcon from '@material-ui/icons/HomeTwoTone'
import LocationOnIcon from '@material-ui/icons/LocationOnTwoTone'
import MapIcon from '@material-ui/icons/MapTwoTone'
import LocalLibraryIcon from '@material-ui/icons/LocalLibraryTwoTone'
import BookIcon from '@material-ui/icons/BookTwoTone'
import HeadsetIcon from '@material-ui/icons/HeadsetTwoTone'
import MovieIcon from '@material-ui/icons/MovieTwoTone'
import SearchIcon from '@material-ui/icons/SearchTwoTone'

import { makeStyles } from '@material-ui/core/styles'

import { useViewStateValue } from './context/viewState'

import PostcodeSearch from './PostcodeSearch'

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  appBarTransparent: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'rgba(250, 250, 250, 0.8)'
  },
  grow: {
    flexGrow: 1
  },
  iconTitle: {
    marginLeft: theme.spacing(1)
  },
  progress: {
    margin: theme.spacing(1)
  },
  tabBar: {
    borderTop: '1px solid #e8e8e8',
    borderBottom: '1px solid #e8e8e8'
  },
  title: {
    margin: theme.spacing(2),
    display: 'inline-block',
    verticalAlign: 'middle'
  }
}))

function AppHeader () {
  const [{ loadingOrganisations, loadingMobiles, loadingRoutes, loadingMobileLocations, loadingNearestMobiles, loadingPostcode }] = useViewStateValue()

  const [appsOpen, setAppsOpen] = useState(false)
  const [tabValue, setTabValue] = useState(1)

  const loading = loadingOrganisations || loadingMobiles || loadingRoutes || loadingMobileLocations || loadingNearestMobiles || loadingPostcode

  const location = useLocation()
  const classes = useStyles()

  const sites = [
    {
      title: 'Libraries at home',
      url: 'https://www.librariesathome.co.uk',
      icon: <HomeIcon />,
      links: [
        {
          title: <span className={classes.iconTitle}>Search</span>,
          short: <span className={classes.iconTitle}>Search</span>,
          icon: <SearchIcon />,
          to: 'https://www.librariesathome.co.uk'
        },
        {
          title: <span className={classes.iconTitle}>Watch</span>,
          short: <span className={classes.iconTitle}>Watch</span>,
          icon: <MovieIcon />,
          to: 'https://www.librariesathome.co.uk/watch'
        },
        {
          title: <span className={classes.iconTitle}>Read</span>,
          short: <span className={classes.iconTitle}>Read</span>,
          icon: <BookIcon />,
          to: 'https://www.librariesathome.co.uk/read'
        },
        {
          title: <span className={classes.iconTitle}>Listen</span>,
          short: <span className={classes.iconTitle}>Listen</span>,
          icon: <HeadsetIcon />,
          to: 'https://www.librariesathome.co.uk/listen'
        }
      ]
    },
    {
      title: 'Mobile libraries',
      url: 'https://www.mobilelibraries.org',
      icon: <DirectionBusIcon />,
      links: [
        {
          title: <span className={classes.iconTitle}>Mobile vans</span>,
          short: <span className={classes.iconTitle}>Vans</span>,
          icon: <DirectionBusIcon />,
          to: 'https://www.mobilelibraries.org/'
        },
        {
          title: <span className={classes.iconTitle}>Stop locations</span>,
          short: <span className={classes.iconTitle}>Stops</span>,
          icon: <LocationOnIcon />,
          to: 'https://www.mobilelibraries.org/stops'
        },
        {
          title: <span className={classes.iconTitle}>Map</span>,
          short: <span className={classes.iconTitle}>Map</span>,
          icon: <MapIcon />,
          to: 'https://www.mobilelibraries.org/map'
        }
      ]
    },
    {
      title: 'Library map',
      url: 'https://www.librarymap.co.uk',
      icon: <LocalLibraryIcon />,
      links: [

      ]
    }
  ]

  const site = 1

  const siteUrl = sites[site].url

  return (
    <>
      <Container maxWidth='lg'>
        <IconButton color='primary' onClick={() => { setAppsOpen(!appsOpen) }}>
          <WidgetsIcon />
        </IconButton>
        <Typography color='secondary' variant='h6' component='h1' className={classes.title}>{sites[site].title}</Typography>
      </Container>
      {appsOpen ? (
        <AppBar position='static' color='default' elevation={0}>
          <Container maxWidth='lg'>
            <Tabs
              className={classes.tabBar}
              value={tabValue}
              onChange={(e, v) => { setTabValue(v) }}
              variant='scrollable'
              scrollButtons='on'
              indicatorColor='primary'
              textColor='primary'
            >
              {sites.map((site, idx) => {
                return (
                  <Tab key={'tb_site_' + idx} label={site.title} icon={site.icon} />
                )
              })}
            </Tabs>
          </Container>
        </AppBar>
      ) : null}
      <AppBar
        position={(location.pathname === '/map' ? 'fixed' : 'static')}
        color='inherit'
        elevation={0}
        className={(location.pathname === '/map' ? classes.appBarTransparent : classes.appBar)}
      >
        <Container maxWidth='lg'>
          <Toolbar>
            <Hidden smUp>
              {sites[tabValue].links.map((link, idx) => {
                return (
                  <Tooltip title={link.title} key={'icnb_menu_md_' + idx}>
                    <IconButton
                      component={Link}
                      to={link.to.replace(siteUrl, '')}
                      disableRipple={location.pathname === link.to.replace(siteUrl, '')}
                      disableFocusRipple={location.pathname === link.to.replace(siteUrl, '')}
                      color={(location.pathname === link.to.replace(siteUrl, '') ? 'secondary' : 'primary')}
                    >
                      {link.icon}
                    </IconButton>
                  </Tooltip>
                )
              })}
            </Hidden>
            <Hidden xsDown mdUp>
              {sites[tabValue].links.map((link, idx) => {
                return (
                  <Tooltip title={link.title} key={'icnb_menu_lg_' + idx}>
                    <Button
                      component={Link}
                      to={link.to.replace(siteUrl, '')}
                      disableRipple={location.pathname === link.to.replace(siteUrl, '')}
                      disableFocusRipple={location.pathname === link.to.replace(siteUrl, '')}
                      color={(location.pathname === link.to.replace(siteUrl, '') ? 'secondary' : 'primary')}
                      size='large'
                    >
                      {link.icon}{link.short}
                    </Button>
                  </Tooltip>
                )
              })}
            </Hidden>
            <Hidden smDown>
              {sites[tabValue].links.map((link, idx) => {
                return (
                  <Tooltip title={link.title} key={'icnb_menu_lg_' + idx}>
                    <Button
                      component={Link}
                      to={link.to.replace(siteUrl, '')}
                      disableRipple={location.pathname === link.to.replace(siteUrl, '')}
                      disableFocusRipple={location.pathname === link.to.replace(siteUrl, '')}
                      color={(location.pathname === link.to.replace(siteUrl, '') ? 'secondary' : 'primary')}
                      size='large'
                    >
                      {link.icon}{link.title}
                    </Button>
                  </Tooltip>
                )
              })}
            </Hidden>
            {loading ? <CircularProgress className={classes.progress} color='primary' size={30} /> : null}
            <span className={classes.grow} />
            {location.pathname === '/map' ? <PostcodeSearch /> : null}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}

export default AppHeader
