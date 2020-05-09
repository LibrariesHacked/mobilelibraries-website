// React
import React, { Component } from 'react';

// Other core stuff
import PropTypes from 'prop-types';
import { BrowserRouter, Route } from "react-router-dom";

// Material UI
import CloseIcon from '@material-ui/icons/Close';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';

// MUI Style
import deepOrange from '@material-ui/core/colors/deepOrange';
import brown from '@material-ui/core/colors/brown';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';

// Our components
import AppHeader from './AppHeader';
import Mobiles from './Mobiles';
import MobileMap from './MobileMap';
import Stops from './Stops';
import StopDetails from './StopDetails';
import TripDetails from './TripDetails';

// Our helpers
import * as geoHelper from './helpers/geo';
import * as mobilesHelper from './helpers/mobiles';
import * as organisationsHelper from './helpers/organisations';
import * as routesHelper from './helpers/routes';
import * as stopsHelper from './helpers/stops';
import * as tripsHelper from './helpers/trips';

const theme = createMuiTheme({
  palette: {
    primary: deepOrange,
    secondary: brown
  },
  overrides: {
    MuiButton: {
      text: {
        textTransform: 'none'
      }
    },
    MuiTab: {
      root: {
        textTransform: 'none'
      }
    },
    MuiTableCell: {
      root: {
        borderBottom: 'none'
      }
    },
  }
});

const styles = theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
});

class App extends Component {
  state = {
    // Stop dialog
    stop_dialog_open: false,
    current_stop: {},
    // Trip dialog
    trip_dialog_open: false,
    current_trip: {},
    // Organisation data
    organisations: [],
    organisation_lookup: {},
    organisation_filter: [],
    // Mobile data
    mobiles: [],
    mobile_lookup: {},
    mobile_filter: [],
    mobile_locations: [],
    mobile_location_lookup: {},
    mobiles_nearest: [],
    mobiles_nearest_lookup: {},
    mobile_location_timer: null,
    // Route data
    routes: [],
    route_lookup: {},
    route_filter: [],
    // Map view settings
    fit_bounds: null,
    position: [-2.1000, 53.6138],
    zoom: [7],
    pitch: [0],
    bearing: [0],
    // Search
    search_type: '', // search types can be gps, postcode, service
    distance: 1609,
    postcode: '',
    postcode_district: '',
    // GPS
    current_position: [],
    position_update_interval: '',
    map_settings: {
      authority_boundary: false
    },
    // Loading indicators
    loading_gps: true,
    loading_mobiles: false,
    loading_organisations: false,
    loading_postcode: true,
    loading_routes: false,
    // Snackbar
    snackbar_open: false,
    snackbar_message: ''
  };

  getOrganisations = () => {
    this.setState({ loading_organisations: true });
    organisationsHelper.getAllOrganisations(organisations => {
      let organisation_lookup = {};
      organisations.forEach(organisation => organisation_lookup[organisation.id] = organisation);
      this.setState({ organisations: organisations, organisation_lookup: organisation_lookup, loading_organisations: false })
    });
  }

  getMobiles = () => {
    this.setState({ loading_mobiles: true });
    mobilesHelper.getAllMobiles(mobiles => {
      let mobile_lookup = {};
      mobiles.forEach(mobile => mobile_lookup[mobile.id] = mobile);
      this.setState({ mobiles: mobiles, mobile_lookup: mobile_lookup, loading_mobiles: false });
    });
  }

  getRoutes = () => {
    this.setState({ loading_routes: true });
    routesHelper.getAllRoutes(routes => {
      let route_lookup = {};
      routes.forEach(route => route_lookup[route.id] = route);
      this.setState({ routes: routes, route_lookup: route_lookup, loading_routes: false });
    });
  }

  getMobileLocations = () => {
    mobilesHelper.getMobileLocations(locations => {
      let mobile_location_lookup = {};
      locations.forEach(location => mobile_location_lookup[location.mobile_id] = location);
      this.setState({ mobile_locations: locations, mobile_location_lookup: mobile_location_lookup });
    });
  }

  getMobilesNearest = () => {
    mobilesHelper.getMobilesNearest(this.state.current_position, this.state.distance, mobiles => {
      let mobiles_nearest_lookup = {};
      mobiles.forEach(mobile => mobiles_nearest_lookup[mobile.mobile_id] = mobile);
      this.setState({ mobiles_nearest: mobiles, mobiles_nearest_lookup: mobiles_nearest_lookup });
    });
  }

  componentDidMount = () => {
    this.getOrganisations();
    this.getMobiles();
    this.getRoutes();
    this.getMobileLocations();
    // Set up a timer for the mobile locations
    const mobile_location_timer = setInterval(() => {
      this.getMobileLocations();
    }, 15000);
    this.setState({ mobile_location_timer: mobile_location_timer });
  }

  viewStop = (stop) => {
    // First open the dialog
    this.openStopDialog(stop);
    // We may or may not have a complete stop object.
    // If calling from the stop table we do - if not we don't, all we have is ID
    if (!stop.name) {
      stopsHelper.getStopById(stop.id, stop => {
        this.setState({ current_stop: stop })
      });
    }
  }
  openStopDialog = (stop) => this.setState({ current_stop: stop, stop_dialog_open: true });
  closeStopDialog = () => this.setState({ stop_dialog_open: false });

  viewTrip = (trip) => {
    // First open the dialog
    this.openTripDialog(trip);
    tripsHelper.getTripById(trip.id, trip => {
      this.setState({ current_trip: trip })
    });
  }
  openTripDialog = (trip) => this.setState({ current_trip: trip, trip_dialog_open: true });
  closeTripDialog = () => this.setState({ trip_dialog_open: false });

  viewStopsByOrganisation = (organisation_id) => this.setState({ page: 'stops', organisation_filter: [organisation_id], mobile_filter: [], route_filter: [] });
  viewStopsByMobile = (organisation_id, mobile_id) => this.setState({ page: 'stops', organisation_filter: [organisation_id], mobile_filter: [mobile_id], route_filter: [] });
  viewStopsByRoute = (organisation_id, mobile_id, route_id) => this.setState({ page: 'stops', organisation_filter: [organisation_id], mobile_filter: [mobile_id], route_filter: [route_id] });
  clearMobileFilter = () => this.setState({ mobile_filter: [], route_filter: [] });
  clearRouteFilter = () => this.setState({ route_filter: [] });
  clearOrganisationFilter = () => this.setState({ organisation_filter: [], mobile_filter: [], route_filter: [] });

  viewMapStop = (longitude, latitude) => this.setState({ page: 'map', position: [longitude, latitude], zoom: [15], stop_dialog_open: false });

  logPosition = (fit = false) => {
    this.setState({ loading_gps: true });
    geoHelper.getCurrentPosition(position => {
      if (position.length === 2) {
        this.getMobilesNearest();
        this.setState({ current_position: position, position: position, zoom: [12], loading_gps: false });
      } else {
        clearInterval(this.state.position_update_interval);
        this.setState({ search_type: '', postcode: '', current_position: [], position_update_interval: null, snackbar_open: true, snackbar_message: 'Could not fetch current location' });
      }
    });
  }

  setDistance = (distance) => this.setState({ distance: distance });

  clearSearch = () => {
    this.setState({ postcode: '', postcode_district: '', current_position: [], search_type: '', organisation_filter: [], mobile_filter: [], route_filter: [] });
  }

  // postcodeSearch
  postcodeSearch = (postcode) => {

    if (postcode === '') {
      this.setState({ snackbar_open: true, snackbar_message: 'You must enter a postcode', postcode_district: '' });
      return;
    }

    let new_state = { search_type: 'postcode', loading_postcode: true, postcode: postcode, organisation_filter: [], mobile_filter: [], route_filter: [] };

    // If we're already tracking GPS then turn this off
    if (this.state.search_type === 'gps') {
      clearInterval(this.state.position_update_interval);
      new_state.position_update_interval = null;
    }

    // Get the postcode
    geoHelper.getPostcode(postcode, postcode_data => {
      if (postcode_data.location && postcode_data.location.length === 2) {
        new_state.search_type = 'postcode';
        new_state.current_position = postcode_data.location;
        new_state.position = postcode_data.location;
        new_state.zoom = [11];
        new_state.loading_postcode = false;
        new_state.postcode_district = postcode_data.admin_district;
        this.setState(new_state);
        this.getMobilesNearest();
      } else {
        this.setState({ snackbar_open: true, snackbar_message: 'Could not find postcode', postcode_district: '' });
      }
    });
  }

  // toggleGPS
  toggleGPS = () => {
    // If we're already tracking GPS then turn this off
    if (this.state.search_type === 'gps') {
      clearInterval(this.state.position_update_interval);
      this.setState({ search_type: '', postcode: '', current_position: [], position_update_interval: null });
    } else {
      let position_update_interval = setInterval(this.logPosition, 10000);
      this.setState({ position_update_interval: position_update_interval, search_type: 'gps', postcode: '', organisation_filter: [], mobile_filter: [], route_filter: [] });
      this.logPosition(true);
    }
  }

  toggleMapSetting = (setting) => {
    const current_setting = this.state[setting];
    this.setState({ [setting]: !current_setting })
  }

  closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbar_open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <div className={classes.root}>
            <CssBaseline />
            <AppHeader
              loading={this.state.loading_mobiles || this.state.loading_organisations || this.state.loading_routes}
              postcode={this.state.postcode}
              distance={this.state.distance}
              search_type={this.state.search_type}
              setDistance={this.setDistance}
              toggleGPS={this.toggleGPS}
              postcodeSearch={this.postcodeSearch}
              clearSearch={this.clearSearch}
            />
            <main className={classes.content}>
              <div className={classes.toolbar} />
              <Route
                path='/'
                exact
                render={() => {
                  return (<Mobiles
                    mobiles={this.state.mobiles}
                    mobile_lookup={this.state.mobile_lookup}
                    mobile_location_lookup={this.state.mobile_location_lookup}
                    mobiles_nearest_lookup={this.state.mobiles_nearest_lookup}
                    organisation_lookup={this.state.organisation_lookup}
                    viewStop={this.viewStop}
                    viewStopsByMobile={this.viewStopsByMobile}
                    viewStopsByOrganisation={this.viewStopsByOrganisation}
                    organisations={this.state.organisations}
                    organisation_filter={this.state.organisation_filter}
                    setOrganisationFilter={(organisation_id) => { this.setState({ organisation_filter: [organisation_id] }) }}
                    clearOrganisationFilter={this.clearOrganisationFilter}
                    mobile_filter={this.state.mobile_filter}
                    setMobileFilter={(mobile_id) => { this.setState({ mobile_filter: [mobile_id] }) }}
                    clearMobileFilter={this.clearMobileFilter}
                    routes={this.state.routes}
                    route_lookup={this.state.route_lookup}
                    route_filter={this.state.route_filter}
                    setRouteFilter={(route_id) => { this.setState({ route_filter: [route_id] }) }}
                    clearRouteFilter={this.clearRouteFilter}
                    postcode={this.state.postcode}
                    postcode_district={this.state.postcode_district}
                    distance={this.state.distance}
                    search_type={this.state.search_type}
                    setDistance={this.setDistance}
                    toggleGPS={this.toggleGPS}
                    postcodeSearch={this.postcodeSearch}
                    clearSearch={this.clearSearch}
                  />)
                }}
              />

              <Route
                path='/stops'
                render={() => {
                  return (
                    <Stops
                      organisations={this.state.organisations}
                      organisation_lookup={this.state.organisation_lookup}
                      organisation_filter={this.state.organisation_filter}
                      setOrganisationFilter={(organisation_id) => { this.setState({ organisation_filter: [organisation_id] }) }}
                      clearOrganisationFilter={this.clearOrganisationFilter}
                      mobiles={this.state.mobiles}
                      mobile_lookup={this.state.mobile_lookup}
                      mobile_filter={this.state.mobile_filter}
                      setMobileFilter={(mobile_id) => { this.setState({ mobile_filter: [mobile_id] }) }}
                      clearMobileFilter={this.clearMobileFilter}
                      routes={this.state.routes}
                      route_lookup={this.state.route_lookup}
                      route_filter={this.state.route_filter}
                      setRouteFilter={(route_id) => { this.setState({ route_filter: [route_id] }) }}
                      clearRouteFilter={this.clearRouteFilter}
                      viewStop={this.viewStop}
                      viewMapStop={this.viewMapStop}
                      current_position={this.state.current_position}
                      postcode={this.state.postcode}
                      postcode_district={this.state.postcode_district}
                      distance={this.state.distance}
                      search_type={this.state.search_type}
                      setDistance={this.setDistance}
                      toggleGPS={this.toggleGPS}
                      postcodeSearch={this.postcodeSearch}
                      clearSearch={this.clearSearch}
                    />)
                }}
              />
              <Route
                path='/map'
                render={() => {
                  return (
                    <MobileMap
                      bearing={this.state.bearing}
                      fit_bounds={this.state.fit_bounds}
                      pitch={this.state.pitch}
                      position={this.state.position}
                      current_position={this.state.current_position}
                      zoom={this.state.zoom}
                      search_type={this.state.search_type}
                      mobile_lookup={this.state.mobile_lookup}
                      mobile_locations={this.state.mobile_locations.filter(l => l.geox !== null)}
                      organisations={this.state.organisations}
                      organisation_lookup={this.state.organisation_lookup}
                      map_settings={this.state.map_settings}
                      toggleMapSetting={this.toggleMapSetting}
                      viewStop={this.viewStop}
                      viewTrip={this.viewTrip}
                    />)
                }}
              />
            </main>
            <StopDetails
              stop={this.state.current_stop}
              open={this.state.stop_dialog_open}
              close={() => this.closeStopDialog()}
              viewMapStop={this.viewMapStop}
            />
            <TripDetails
              trip={this.state.current_trip}
              open={this.state.trip_dialog_open}
              close={() => this.closeTripDialog()}
            />
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              open={this.state.snackbar_open}
              autoHideDuration={4000}
              onClose={this.closeSnackbar}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">{this.state.snackbar_message}</span>}
              action={[
                <IconButton
                  key="close"
                  aria-label="close"
                  color="inherit"
                  className={classes.close}
                  onClick={this.closeSnackbar}
                >
                  <CloseIcon />
                </IconButton>,
              ]}
            />
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(App);