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
import MobileMap from './MobileMap';

const styles = theme => ({
	root: {
		display: 'flex',
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	}
});

class App extends Component {
	state = {
		drawer_open: false,
		page: 'dashboard',
		// Map variables, sent down to the map for updates.
		fit_bounds: null,
		position: [-4.1429, 50.3732],
		zoom: [12],
		pitch: [0],
		bearing: [0]
	};

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<CssBaseline />
				<AppHeader
					drawer_open={this.state.drawer_open}
					setPage={(page) => this.setState({ page: page })}
					openDrawer={() => this.setState({ drawer_open: true })} />
				<AppDrawer
					drawer_open={this.state.drawer_open}
					closeDrawer={() => this.setState({ drawer_open: false })} />
				<main className={classes.content}>
					<div className={classes.toolbar} />
					{this.state.page === 'dashboard' ?
						<div /> : null}
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