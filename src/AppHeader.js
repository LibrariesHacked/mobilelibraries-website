import React, { useState } from 'react'

import { Link, useLocation } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import Container from '@material-ui/core/Container'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'

import BookIcon from '@material-ui/icons/BookTwoTone'
import CancelIcon from '@material-ui/icons/CancelTwoTone'
import DirectionBusIcon from '@material-ui/icons/DirectionsBusTwoTone'
import GridOnIcon from '@material-ui/icons/GridOnTwoTone'
import HeadsetIcon from '@material-ui/icons/HeadsetTwoTone'
import ImportContactsIcon from '@material-ui/icons/ImportContactsTwoTone'
import MapIcon from '@material-ui/icons/MapTwoTone'
import MovieIcon from '@material-ui/icons/MovieTwoTone'
import SearchIcon from '@material-ui/icons/SearchTwoTone'
import PetsIcon from '@material-ui/icons/PetsTwoTone'

import { makeStyles } from '@material-ui/core/styles'

import PostcodeSearch from './PostcodeSearch'
import ServiceFilter from './ServiceFilter'

import { useSearchStateValue } from './context/searchState'

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'white',
    position: 'relative'
  },
  appBarTransparent: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    position: 'relative'
  },
  grow: {
    flexGrow: 1
  },
  siteTitle: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    display: 'inline-block',
    verticalAlign: 'middle',
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    border: '1px solid #e5e5e5',
    borderRadius: 26
  },
  siteTitleIcon: {
    verticalAlign: 'sub'
  },
  title: {
    margin: theme.spacing(2),
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  topIcon: {
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    border: '1px solid #e5e5e5',
    '&:hover': {
      backgroundColor: 'rgba(250, 250, 250, 0.8)'
    }
  },
  topTitle: {
    position: 'relative',
    zIndex: theme.zIndex.drawer + 1
  }
}))

function AppHeader (props) {
  const { site } = props
  const [{ currentServiceSystemName }, dispatchSearch] = useSearchStateValue() //eslint-disable-line

  const [appsOpen, setAppsOpen] = useState(false)
  const [tabValue, setTabValue] = useState(site)

  const location = useLocation()
  const classes = useStyles()

  const currentServicePath = (path) => {
    if (currentServiceSystemName) return path + '?service=' + currentServiceSystemName
    return path
  }

  const sites = [
    {
      title: 'Library lab',
      url: 'https://www.librarylab.uk',
      icon: <PetsIcon />,
      links: [
        {
          title: 'About library lab',
          short: 'Lab',
          icon: <PetsIcon />,
          to: '/'
        }
      ]
    },
    {
      title: 'Libraries at home',
      url: 'https://www.librariesathome.co.uk',
      icon: <ImportContactsIcon />,
      links: [
        {
          title: 'Find service',
          short: 'Find',
          icon: <SearchIcon />,
          to: currentServicePath('/')
        },
        {
          title: 'Watch library TV',
          short: 'Watch',
          icon: <MovieIcon />,
          to: '/watch'
        },
        {
          title: 'Read blogs',
          short: 'Read',
          icon: <BookIcon />,
          to: '/read'
        },
        {
          title: 'Listen podcasts',
          short: 'Listen',
          icon: <HeadsetIcon />,
          to: '/listen'
        }
      ]
    },
    {
      title: 'Mobile libraries',
      url: 'https://www.mobilelibraries.org',
      icon: <DirectionBusIcon />,
      links: [
        {
          title: 'Find my stop',
          short: 'Stops',
          icon: <GridOnIcon />,
          to: '/'
        },
        {
          title: 'Mobile vans',
          short: 'Vans',
          icon: <DirectionBusIcon />,
          to: '/mobiles'
        },
        {
          title: 'Map of stops',
          short: 'Map',
          icon: <MapIcon />,
          to: '/map'
        }
      ]
    },
    {
      title: 'Library map',
      url: 'https://www.librarymap.co.uk',
      icon: <MapIcon />,
      links: [
        {
          title: 'Find my library',
          short: 'Find',
          icon: <GridOnIcon />,
          to: currentServicePath('/')
        },
        {
          title: 'Map of libraries',
          short: 'Map',
          icon: <MapIcon />,
          to: currentServicePath('/map')
        }
      ]
    }
  ]

  const appBarClass = (location.pathname === '/map' ? classes.appBarTransparent : classes.appBar)

  return (
    <>
      <Container maxWidth='lg' className={classes.topTitle}>
        <Toolbar>
          <IconButton aria-label='Toggle site menu' className={classes.topIcon} color='primary' onClick={() => { setAppsOpen(!appsOpen); setTabValue(site) }}>
            {appsOpen ? <CancelIcon /> : <PetsIcon />}
          </IconButton>
          <span className={classes.grow} />
          {location.pathname === '/map' ? <ServiceFilter /> : null}
          <Chip
            label={sites[site].title}
            color='secondary'
          />
        </Toolbar>
      </Container>
      {appsOpen ? (
        <AppBar position='static' color='default' elevation={0} className={appBarClass}>
          <Container maxWidth='lg'>
            <Tabs
              centered
              value={tabValue}
              onChange={(e, v) => { setTabValue(v) }}
              variant='scrollable'
              scrollButtons='on'
              indicatorColor='primary'
              textColor='secondary'
            >
              {sites.map((s, idx) => {
                return (
                  <Tab key={'tb_site_' + idx} label={s.title} icon={s.icon} />
                )
              })}
            </Tabs>
          </Container>
        </AppBar>
      ) : null}
      <AppBar
        position='static'
        color='inherit'
        elevation={0}
        className={appBarClass}
      >
        <Container maxWidth='lg'>
          <Toolbar>
            <Hidden mdUp>
              {sites[tabValue].links.map((link, idx) => {
                return (
                  <Tooltip title={link.title} key={'icnb_menu_lg_' + idx}>
                    <Button
                      component={Link}
                      to={(tabValue === site ? link.to : sites[tabValue].url + link.to)}
                      disableRipple={location.pathname === link.to}
                      disableFocusRipple={location.pathname === link.to}
                      color='secondary'
                      size='large'
                      startIcon={link.icon}
                    >
                      {link.short}
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
                      to={(tabValue === site ? link.to : sites[tabValue].url + link.to)}
                      disableRipple={location.pathname === link.to}
                      disableFocusRipple={location.pathname === link.to}
                      color='secondary'
                      size='large'
                      startIcon={link.icon}
                    >
                      {link.title}
                    </Button>
                  </Tooltip>
                )
              })}
            </Hidden>
            <span className={classes.grow} />
            {location.pathname === '/map' ? <PostcodeSearch /> : null}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}

export default AppHeader
