// React
import React, { useState } from 'react'

import { Link, useLocation } from 'react-router-dom'

// Material UI
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

// Icons
import AppsIcon from '@material-ui/icons/AppsTwoTone'
import DirectionBusIcon from '@material-ui/icons/DirectionsBusTwoTone'
import HomeIcon from '@material-ui/icons/HomeTwoTone'
import LocationOnIcon from '@material-ui/icons/LocationOnTwoTone'
import MapIcon from '@material-ui/icons/MapTwoTone'
import BusinessIcon from '@material-ui/icons/BusinessTwoTone'

// Material UI Styles
import { makeStyles } from '@material-ui/core/styles'

import { useViewStateValue } from './context/viewState'

// Our components
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
  leftIcon: {
    marginRight: theme.spacing(1)
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

function AppHeader (props) {
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
          title: 'Mobile vans',
          icon: <DirectionBusIcon className={classes.leftIcon} />
        }
      ]
    },
    {
      title: 'Libraries',
      url: 'https://www.libraries.org',
      icon: <BusinessIcon />,
      links: [
        {
          title: 'Mobile vans',
          icon: <DirectionBusIcon className={classes.leftIcon} />
        }
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
                <Button
                  component={Link} to='/' color={(location.pathname === '/' ? 'primary' : 'secondary')} size='large'
                  onClick={() => { }}
                >
                  <DirectionBusIcon className={classes.leftIcon} />Mobile vans
                </Button>
                <Button
                  component={Link} to='/stops' color={(location.pathname === '/stops' ? 'primary' : 'secondary')} size='large'
                  onClick={() => { }}
                >
                  <LocationOnIcon className={classes.leftIcon} />Stop locations
                </Button>
                <Button
                  component={Link} to='/map' color={(location.pathname === '/map' ? 'primary' : 'secondary')} size='large'
                  onClick={() => { }}
                >
                  <MapIcon className={classes.leftIcon} />Map
                </Button>
              </>
            </Hidden>
            <Hidden mdUp>
              <>
                {sites[tabValue].links.map((link, idx) => {
                  return (
                    <IconButton key={'icnb_menu_sml_' + idx} component={Link} to='/' onClick={() => { }}>
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
