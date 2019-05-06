// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Grid from '@material-ui/core/Grid';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';
import StopCard from './StopCard';

const styles = theme => ({
	root: {
		flexGrow: 1
	}
});

class Stops extends Component {
	state = {
	};

	render() {
		const { classes, stops } = this.props;
		return (
			<div className={classes.root}>

			</div>
		);
	}
}

Stops.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(Stops);