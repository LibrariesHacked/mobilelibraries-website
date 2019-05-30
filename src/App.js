// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import CssBaseline from '@material-ui/core/CssBaseline';

// MUI Style
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

// Our components
import AppDrawer from './AppDrawer';
import AppHeader from './AppHeader';
import Mobiles from './Mobiles';
import MobileMap from './MobileMap';
import Organisations from './Organisations';
import Routes from './Routes';
import Stops from './Stops';

import * as mobilesHelper from './helpers/mobiles';
import * as organisationsHelper from './helpers/organisations';
import * as routesHelper from './helpers/routes';

const theme = createMuiTheme({
	palette: {
		primary: blue,
		secondary: green,
		error: red,
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
		drawer_open: false,
		page: 'dashboard',
		dashboard: 'mobiles',
		// Data storage
		organisations: [],
		organisation_lookup: {},
		organisation_filter: [],
		mobiles: [],
		mobile_lookup: {},
		mobile_filter: [],
		routes: [],
		route_lookup: {},
		route_filter: [],
		// Map variables, sent down to the map for updates.
		fit_bounds: null,
		position: [-4.1429, 50.3732],
		zoom: [12],
		pitch: [0],
		bearing: [0]
	};

	// componentDidMount: sets up data and any logging
	componentDidMount = () => {
		mobilesHelper.getAllMobiles(mobiles => {
			let mobile_lookup = {};
			mobiles.forEach(mobile => mobile_lookup[mobile.id] = mobile);
			this.setState({ mobiles: mobiles, mobile_lookup: mobile_lookup });
		});

		organisationsHelper.getAllOrganisations(organisations => {
			let organisation_lookup = {};
			organisations.forEach(organisation => organisation_lookup[organisation.id] = organisation);
			this.setState({ organisations: organisations, organisation_lookup: organisation_lookup })
		});

		routesHelper.getAllRoutes(routes => {
			let route_lookup = {};
			routes.forEach(route => route_lookup[route.id] = route);
			this.setState({ routes: routes, route_lookup: route_lookup })
		});
	}

	setPage = (page) => this.setState({ page: page })
	setDashboard = (dashboard) => this.setState({ dashboard: dashboard })

	viewStopsByMobile = (mobile_id) => {
		this.setState({ page: 'dashboard', dashboard: 'stops', mobile_filter: [mobile_id] });
	}

	viewStopsByRoute = (route_id) => {
		this.setState({ page: 'dashboard', dashboard: 'stops', route_filter: [route_id] });
	}

	openDrawer = () => this.setState({ drawer_open: true })
	closeDrawer = () => this.setState({ drawer_open: false })

	render() {
		const { classes } = this.props;
		return (
			<MuiThemeProvider theme={theme}>
				<div className={classes.root}>
					<CssBaseline />
					<AppHeader
						drawer_open={this.state.drawer_open}
						setPage={this.setPage}
						openDrawer={this.openDrawer} />
					<AppDrawer
						drawer_open={this.state.drawer_open}
						setDashboard={this.setDashboard}
						closeDrawer={this.closeDrawer} />
					<main className={classes.content}>
						<div className={classes.toolbar} />
						{this.state.page === 'dashboard' && this.state.dashboard === 'organisations' ?
							<Organisations
								organisations={this.state.organisations}
							/> : null}
						{this.state.page === 'dashboard' && this.state.dashboard === 'mobiles' ?
							<Mobiles
								mobiles={this.state.mobiles}
								organisation_lookup={this.state.organisation_lookup}
								viewStopsByMobile={this.viewStopsByMobile}
							/> : null}
						{this.state.page === 'dashboard' && this.state.dashboard === 'routes' ?
							<Routes
								routes={this.state.routes}
								organisation_lookup={this.state.organisation_lookup}
								mobile_lookup={this.state.mobile_lookup}
								viewStopsByRoute={this.viewStopsByRoute}
							/> : null}
						{this.state.page === 'dashboard' && this.state.dashboard === 'stops' ?
							<Stops
								organisation_lookup={this.state.organisation_lookup}
								organisation_filter={this.state.organisation_filter}
								mobile_lookup={this.state.mobile_lookup}
								mobile_filter={this.state.mobile_filter}
								route_lookup={this.state.route_lookup}
								route_filter={this.state.route_filter}
							/> : null}
						{this.state.page === 'map' ?
							<MobileMap
								bearing={this.state.bearing}
								fit_bounds={this.state.fit_bounds}
								pitch={this.state.pitch}
								position={this.state.position}
								zoom={this.state.zoom}
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