// React
import React, { Component } from 'react'

// Other core stuff
import compose from 'recompose/compose'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'

// Material UI
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

// Icons
import DirectionBusIcon from '@material-ui/icons/DirectionsBusTwoTone'
import LocationOnIcon from '@material-ui/icons/LocationOnTwoTone'
import MapIcon from '@material-ui/icons/MapTwoTone'

// Material UI Styles
import { withStyles } from '@material-ui/core/styles'

// Our components
import PostcodeSearch from './PostcodeSearch'

const styles = theme => ({
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
  hide: {
    display: 'none'
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  progress: {
    margin: theme.spacing(1)
  },
  title: {
    margin: theme.spacing(2)
  }
})

class AppHeader extends Component {
  render () {
    const { loading, classes, searchType, postcode, distance, toggleGPS, postcodeSearch, clearSearch, setDistance, location } = this.props
    return (
      <>
        <Container maxWidth='lg'>
          <Typography color='textSecondary' variant='h6' component='h1' className={classes.title}>Mobile libraries</Typography>
        </Container>
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
                  <IconButton component={Link} to='/' onClick={() => { }}>
                    <DirectionBusIcon />
                  </IconButton>
                  <IconButton component={Link} to='/stops' onClick={() => { }}>
                    <LocationOnIcon />
                  </IconButton>
                  <IconButton component={Link} to='/map' onClick={() => { }}>
                    <MapIcon />
                  </IconButton>
                </>
              </Hidden>
              {location.pathname === '/map'
                ? <PostcodeSearch
                  postcode={postcode}
                  distance={distance}
                  searchType={searchType}
                  toggleGPS={toggleGPS}
                  setDistance={setDistance}
                  postcodeSearch={postcodeSearch}
                  clearSearch={clearSearch}
                /> : null}
              {loading ? <CircularProgress className={classes.progress} color='secondary' size={30} /> : null}
            </Toolbar>
          </Container>
        </AppBar>
      </>
    )
  }
}

AppHeader.propTypes = {
  classes: PropTypes.object.isRequired
}

export default compose(withRouter, withStyles(styles, { withTheme: true }))(AppHeader)
