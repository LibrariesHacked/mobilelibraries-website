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
import Typography from '@material-ui/core/Typography'

import AppsIcon from '@material-ui/icons/AppsTwoTone'
import DirectionBusIcon from '@material-ui/icons/DirectionsBusTwoTone'
import HomeIcon from '@material-ui/icons/HomeTwoTone'
import LocationOnIcon from '@material-ui/icons/LocationOnTwoTone'
import MapIcon from '@material-ui/icons/MapTwoTone'
import BusinessIcon from '@material-ui/icons/BusinessTwoTone'

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
  const [tabValue] = useState(1)

  const loading = loadingOrganisations || loadingMobiles || loadingRoutes || loadingMobileLocations || loadingNearestMobiles || loadingPostcode

  const location = useLocation()
  const classes = useStyles()

  const sites = [
    {
      title: 'Libraries at home',
      url: 'https://www.librariesathome.co.uk',
      icon: <HomeIcon />,
      links: [

      ]
    },
    {
      title: 'Mobile libraries',
      url: 'https://www.mobilelibraries.org',
      icon: <DirectionBusIcon />,
      links: [
        {
          title: <span className={classes.iconTitle}>Mobile vans</span>,
          icon: <DirectionBusIcon />,
          to: '/'
        },
        {
          title: <span className={classes.iconTitle}>Stop locations</span>,
          icon: <LocationOnIcon />,
          to: '/stops'
        },
        {
          title: <span className={classes.iconTitle}>Map</span>,
          icon: <MapIcon />,
          to: '/map'
        }
      ]
    },
    {
      title: 'Libraries',
      url: 'https://www.libraries.org',
      icon: <BusinessIcon />,
      links: [

      ]
    }
  ]

  return (
    <>
      <Container maxWidth='lg'>
        <IconButton onClick={() => { setAppsOpen(!appsOpen) }}>
          <AppsIcon />
        </IconButton>
        <Typography color='textSecondary' variant='h6' component='h1' className={classes.title}>
          {sites[tabValue].title}
        </Typography>
      </Container>
      {appsOpen ? (
        <AppBar position='static' color='default' elevation={0}>
          <Container maxWidth='lg'>
            <Tabs
              className={classes.tabBar}
              value={tabValue}
              onChange={() => { }}
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
            <Hidden smDown>
              <>
                {sites[tabValue].links.map((link, idx) => {
                  return (
                    <Button
                      key={'icnb_menu_lg_' + idx}
                      component={Link}
                      to={link.to}
                      color={(location.pathname === link.to ? 'primary' : 'secondary')}
                      size='large'
                      onClick={() => { }}
                    >
                      {link.icon}{link.title}
                    </Button>
                  )
                })}
              </>
            </Hidden>
            <Hidden mdUp>
              <>
                {sites[tabValue].links.map((link, idx) => {
                  return (
                    <IconButton
                      key={'icnb_menu_md_' + idx}
                      component={Link}
                      to={link.to}
                      onClick={() => { }}
                      color={(location.pathname === link.to ? 'primary' : 'secondary')}
                    >
                      {link.icon}
                    </IconButton>
                  )
                })}
              </>
            </Hidden>
            {loading ? <CircularProgress className={classes.progress} color='secondary' size={30} /> : null}
            <span className={classes.grow} />
            {location.pathname === '/map' ? <PostcodeSearch /> : null}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}

export default AppHeader
