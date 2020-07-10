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

import BusinessIcon from '@material-ui/icons/BusinessTwoTone'
import DirectionBusIcon from '@material-ui/icons/DirectionsBusTwoTone'
import WeekendIcon from '@material-ui/icons/WeekendTwoTone'
import LocationOnIcon from '@material-ui/icons/LocationOnTwoTone'
import MapIcon from '@material-ui/icons/MapTwoTone'
import BookIcon from '@material-ui/icons/BookTwoTone'
import HeadsetIcon from '@material-ui/icons/HeadsetTwoTone'
import MovieIcon from '@material-ui/icons/MovieTwoTone'
import SearchIcon from '@material-ui/icons/SearchTwoTone'
import WidgetsIcon from '@material-ui/icons/WidgetsTwoTone'

import { makeStyles } from '@material-ui/core/styles'

import PostcodeSearch from './PostcodeSearch'

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    position: 'relative'
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
  const { loading, site } = props

  const [appsOpen, setAppsOpen] = useState(false)
  const [tabValue, setTabValue] = useState(site)

  const location = useLocation()
  const classes = useStyles()

  const sites = [
    {
      title: 'Libraries at home',
      url: 'https://www.librariesathome.co.uk',
      icon: <WeekendIcon />,
      links: [
        {
          title: <span className={classes.iconTitle}>Search</span>,
          short: <span className={classes.iconTitle}>Search</span>,
          icon: <SearchIcon />,
          to: '/'
        },
        {
          title: <span className={classes.iconTitle}>Watch</span>,
          short: <span className={classes.iconTitle}>Watch</span>,
          icon: <MovieIcon />,
          to: '/watch'
        },
        {
          title: <span className={classes.iconTitle}>Read</span>,
          short: <span className={classes.iconTitle}>Read</span>,
          icon: <BookIcon />,
          to: '/read'
        },
        {
          title: <span className={classes.iconTitle}>Listen</span>,
          short: <span className={classes.iconTitle}>Listen</span>,
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
          title: <span className={classes.iconTitle}>Mobile vans</span>,
          short: <span className={classes.iconTitle}>Vans</span>,
          icon: <DirectionBusIcon />,
          to: '/'
        },
        {
          title: <span className={classes.iconTitle}>Stop locations</span>,
          short: <span className={classes.iconTitle}>Stops</span>,
          icon: <LocationOnIcon />,
          to: '/stops'
        },
        {
          title: <span className={classes.iconTitle}>Map</span>,
          short: <span className={classes.iconTitle}>Map</span>,
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
          title: <span className={classes.iconTitle}>Libraries</span>,
          short: <span className={classes.iconTitle}>Libraries</span>,
          icon: <BusinessIcon />,
          to: '/'
        },
        {
          title: <span className={classes.iconTitle}>Library map</span>,
          short: <span className={classes.iconTitle}>Map</span>,
          icon: <MapIcon />,
          to: '/map'
        }
      ]
    }
  ]

  return (
    <>
      <Container maxWidth='lg' className={classes.topTitle}>
        <IconButton className={classes.topIcon} color='primary' onClick={() => { setAppsOpen(!appsOpen); setTabValue(site) }}>
          <WidgetsIcon />
        </IconButton>
        <Typography color='secondary' variant='h6' component='h1' className={classes.title}>{sites[site].title}</Typography>
      </Container>
      {appsOpen ? (
        <AppBar position='static' color='default' elevation={0} className={classes.appBar}>
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
        className={classes.appBar}
      >
        <Container maxWidth='lg'>
          <Toolbar>
            <Hidden smUp>
              {sites[tabValue].links.map((link, idx) => {
                return (
                  <Tooltip title={link.title} key={'icnb_menu_md_' + idx}>
                    <IconButton
                      component={Link}
                      to={(tabValue === site ? link.to : sites[tabValue].url + link.to)}
                      disableRipple={location.pathname === link.to}
                      disableFocusRipple={location.pathname === link.to}
                      color={(tabValue === site && location.pathname === link.to ? 'secondary' : 'primary')}
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
                      to={(tabValue === site ? link.to : sites[tabValue].url + link.to)}
                      disableRipple={location.pathname === link.to}
                      disableFocusRipple={location.pathname === link.to}
                      color={(tabValue === site && location.pathname === link.to ? 'secondary' : 'primary')}
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
                      to={(tabValue === site ? link.to : sites[tabValue].url + link.to)}
                      disableRipple={location.pathname === link.to}
                      disableFocusRipple={location.pathname === link.to}
                      color={(tabValue === site && location.pathname === link.to ? 'secondary' : 'primary')}
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
