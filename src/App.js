// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import CssBaseline from '@material-ui/core/CssBaseline';

// MUI Style
import { withStyles } from '@material-ui/core/styles';

// Our components
import AppDrawer from './AppDrawer';
import AppHeader from './AppHeader';
import Mobiles from './Mobiles';
import MobileMap from './MobileMap';
import Organisations from './Organisations';
import Routes from './Routes';
import Stops from './Stops';

import * as mobilesHelper from './helpers/mobiles';

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
		mobiles: [],
		routes: [],
		stops: [],
		// Map variables, sent down to the map for updates.
		fit_bounds: null,
		position: [-4.1429, 50.3732],
		zoom: [12],
		pitch: [0],
		bearing: [0]
	};

	// componentDidMount: sets up data and any logging
	componentDidMount = () => {
		mobilesHelper.getAllMobiles(mobiles => this.setState({ mobiles: mobiles }));
	}

	setPage = (page) => this.setState({ page: page })
	setDashboard = (dashboard) => this.setState({ dashboard: dashboard })

	closeDrawer = () => this.setState({ drawer_open: false })
	openDrawer = () => this.setState({ drawer_open: true })

	render() {
		const { classes } = this.props;
		return (
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
						/> : null}
					{this.state.page === 'dashboard' && this.state.dashboard === 'routes' ?
						<Routes
							routes={this.state.routes}
						/> : null}
					{this.state.page === 'dashboard' && this.state.dashboard === 'stops' ?
						<Stops
							stops={this.state.stops}
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
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(App);