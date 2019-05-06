// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Grid from '@material-ui/core/Grid';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';
import RouteCard from './RouteCard';

const styles = theme => ({
	root: {
		flexGrow: 1
	}
});

class Routes extends Component {
	state = {
	};

	render() {
		const { classes, routes } = this.props;
		return (
			<div className={classes.root}>

			</div>
		);
	}
}

Routes.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(Routes);