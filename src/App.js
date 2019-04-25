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
	constructor(props) {
		super(props);
		this.state = {
			drawer_open: false
		}
	}
	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<CssBaseline />
				<AppHeader
					drawer_open={this.state.drawer_open}
					openDrawer={() => this.setState({ drawer_open: true })} />
				<AppDrawer
					drawer_open={this.state.drawer_open}
					closeDrawer={() => this.setState({ drawer_open: false })} />
				<main className={classes.content}>
					<div className={classes.toolbar} />
				</main>
			</div>
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(App);