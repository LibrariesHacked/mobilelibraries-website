// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import CssBaseline from '@material-ui/core/CssBaseline';

// MUI Style
import blue from '@material-ui/core/colors/blue';
import deepOrange from '@material-ui/core/colors/deepOrange';
import red from '@material-ui/core/colors/red';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';

// Our components
import AppHeader from './AppHeader';
import Mobiles from './Mobiles';
import MobileMap from './MobileMap';
import Stops from './Stops';

// Our helpers
import * as geoHelper from './helpers/geo';
import * as mobilesHelper from './helpers/mobiles';
import * as organisationsHelper from './helpers/organisations';
import * as routesHelper from './helpers/routes';

const theme = createMuiTheme({
	palette: {
		primary: blue,
		secondary: deepOrange,
		error: red
	},
	overrides: {
		MuiButton: {
			text: {
				textTransform: 'inherit'
			}
		}
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
		page: 'mobiles',
		organisations: [],
		organisation_lookup: {},
		organisation_filter: [],
		mobiles: [],
		mobile_lookup: {},
		mobile_filter: [],
		mobile_locations: [],
		mobile_location_lookup: {},
		location_timer: null,
		routes: [],
		route_lookup: {},
		route_filter: [],
		fit_bounds: null,
		position: [-2.1000, 53.6138],
		zoom: [7],
		pitch: [0],
		bearing: [0],
		gps_loading: true,
		postcode_loading: true,
		current_position: [],
		gps_available: false,
		position_update_interval: '',
		search_type: ''
	};

	getOrganisations = () => {
		organisationsHelper.getAllOrganisations(organisations => {
			let organisation_lookup = {};
			organisations.forEach(organisation => organisation_lookup[organisation.id] = organisation);
			this.setState({ organisations: organisations, organisation_lookup: organisation_lookup })
		});
	}

	getMobiles = () => {
		mobilesHelper.getAllMobiles(mobiles => {
			let mobile_lookup = {};
			mobiles.forEach(mobile => mobile_lookup[mobile.id] = mobile);
			this.setState({ mobiles: mobiles, mobile_lookup: mobile_lookup });
		});
	}

	getRoutes = () => {
		routesHelper.getAllRoutes(routes => {
			let route_lookup = {};
			routes.forEach(route => route_lookup[route.id] = route);
			this.setState({ routes: routes, route_lookup: route_lookup })
		});
	}

	getMobileLocations = () => {
		mobilesHelper.getMobileLocations(locations => {
			let mobile_location_lookup = {};
			locations.forEach(location => mobile_location_lookup[location.mobile_id] = location);
			this.setState({ mobile_locations: locations, mobile_location_lookup: mobile_location_lookup });
		});
	}

	// componentDidMount: sets up data and any logging
	componentDidMount = () => {
		this.getOrganisations();
		this.getMobiles();
		this.getRoutes();
		// Set up a timer for the mobile locations
		this.getMobileLocations();
		const location_timer = setInterval(() => {
			this.getMobileLocations();
		}, 15000);
		this.setState({ location_timer: location_timer });
	}

	setPage = (page) => this.setState({ page: page })

	viewStopsByOrganisation = (organisation_id) => this.setState({ page: 'stops', organisation_filter: [organisation_id], mobile_filter: [], route_filter: [] });
	viewStopsByMobile = (mobile_id) => this.setState({ page: 'stops', organisation_filter: [], mobile_filter: [mobile_id], route_filter: [] });
	viewStopsByRoute = (route_id) => this.setState({ page: 'stops', organisation_filter: [], mobile_filter: [], route_filter: [route_id] });

	clearOrganisationFilter = () => this.setState({ organisation_filter: [], mobile_filter: [], route_filter: [] });
	clearMobileFilter = () => this.setState({ mobile_filter: [], route_filter: [] });
	clearRouteFilter = () => this.setState({ route_filter: [] });

	// logPosition: Retrieve position from gps
	logPosition = (fit = false) => {
		this.setState({ loading: true, gps_loading: true });
		geoHelper.getCurrentPosition(position => {
			this.setState({ current_position: position, gps_loading: false, gps_available: (position.length > 0) });
			this.getLocations('gps', fit);
		});
	}

	// postcodeSearch
	postcodeSearch = (postcode) => {
		// If we're already tracking GPS then turn this off
		let new_state = { search_type: 'postcode', loading: true, postcode_loading: true };
		if (this.state.search_type === 'gps') {
			clearInterval(this.state.position_update_interval);
			new_state.position_update_interval = null;
		}
		this.setState(new_state);
	}

	// toggleGPS
	toggleGPS = () => {
		// If we're already tracking GPS then turn this off
		if (this.state.search_type === 'gps') {
			clearInterval(this.state.position_update_interval);
			this.setState({ search_type: '', postcode: '', position_update_interval: null });
		} else {
			let position_update_interval = setInterval(this.logPosition, 10000);
			this.setState({ position_update_interval: position_update_interval, search_type: 'gps', postcode: '' });
			this.logPosition(true);
		}
	}

	render() {
		const { classes } = this.props;
		return (
			<MuiThemeProvider theme={theme}>
				<div className={classes.root}>
					<CssBaseline />
					<AppHeader
						page={this.state.page}
						setPage={this.setPage}
						search_type={this.state.search_type}
						gps_available={this.state.gps_available}
						toggleGPS={this.toggleGPS}
						postcodeSearch={this.postcodeSearch}
					/>
					<main className={classes.content}>
						<div className={classes.toolbar} />
						{this.state.page === 'mobiles' ?
							<Mobiles
								mobiles={this.state.mobiles}
								mobile_lookup={this.state.mobile_lookup}
								mobile_location_lookup={this.state.mobile_location_lookup}
								organisation_lookup={this.state.organisation_lookup}
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
							/> : null}
						{this.state.page === 'stops' ?
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
							/> : null}
						{this.state.page === 'map' ?
							<MobileMap
								bearing={this.state.bearing}
								fit_bounds={this.state.fit_bounds}
								pitch={this.state.pitch}
								position={this.state.position}
								zoom={this.state.zoom}
								mobile_lookup={this.state.mobile_lookup}
								mobile_locations={this.state.mobile_locations.filter(l => l.geox !== null)}
							/> : null}
					</main>
				</div>
			</MuiThemeProvider>
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(App);