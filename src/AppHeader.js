// React
import React, { Component } from 'react';

// Other core stuff
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { Link, withRouter } from "react-router-dom";

// Material UI
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// Material Icons
import DashboardIcon from '@material-ui/icons/DashboardTwoTone';
import LocationOnIcon from '@material-ui/icons/LocationOnTwoTone';
import MapIcon from '@material-ui/icons/MapTwoTone';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// Our components
import PostcodeSearch from './PostcodeSearch';

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    borderTop: '1px solid #E0E0E0',
    borderBottom: '1px solid #E0E0E0'
  },
  appBarTransparent: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'rgba(250, 250, 250, 0.5)',
    borderTop: '1px solid #E0E0E0',
    borderBottom: '1px solid #E0E0E0'
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
    margin: theme.spacing(3)
  }
});

class AppHeader extends Component {

  render() {
    const { loading, classes, search_type, postcode, distance, toggleGPS, postcodeSearch, clearSearch, setDistance, location } = this.props;
    return (
      <React.Fragment>
        <Container maxWidth="lg">
          <Typography color="textSecondary" variant="h4" component="h1" className={classes.title}>Mobile libraries</Typography>
        </Container>
        <AppBar
          position={(location.pathname === '/map' ? "fixed" : "static")}
          color="inherit"
          elevation={0}
          className={(location.pathname === '/map' ? classes.appBarTransparent : classes.appBar)}
        >
          <Container maxWidth="lg">
            <Toolbar>
              {loading ? <CircularProgress className={classes.progress} color="secondary" size={30} /> : null}
              {location.pathname === '/map' ?
                <PostcodeSearch
                  postcode={postcode}
                  distance={distance}
                  search_type={search_type}
                  toggleGPS={toggleGPS}
                  setDistance={setDistance}
                  postcodeSearch={postcodeSearch}
                  clearSearch={clearSearch}
                /> : null}
              <Hidden smDown>
                <React.Fragment>
                  <Button component={Link} to="/" color="secondary"
                    onClick={() => { }}
                  >
                    <DashboardIcon className={classes.leftIcon} />Mobiles
							</Button>
                  <Button component={Link} to="/stops" color="secondary"
                    onClick={() => { }}
                  >
                    <LocationOnIcon className={classes.leftIcon} />Stops
							</Button>
                  <Button component={Link} to="/map" color="secondary"
                    onClick={() => { }}
                  >
                    <MapIcon className={classes.leftIcon} />Map
							</Button>
                </React.Fragment>
              </Hidden>
              <Hidden mdUp>
                <React.Fragment>
                  <IconButton component={Link} to="/" onClick={() => { }}>
                    <DashboardIcon />
                  </IconButton>
                  <IconButton component={Link} to="/stops" onClick={() => { }}>
                    <LocationOnIcon />
                  </IconButton>
                  <IconButton component={Link} to="/map" onClick={() => { }}>
                    <MapIcon />
                  </IconButton>
                </React.Fragment>
              </Hidden>
            </Toolbar>
          </Container>
        </AppBar>
      </React.Fragment>

    );
  }
}

AppHeader.propTypes = {
  classes: PropTypes.object.isRequired
}

export default compose(withRouter, withStyles(styles, { withTheme: true }))(AppHeader);