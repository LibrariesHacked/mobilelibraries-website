// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary
	}
});

class DashboardMobile extends Component {
	state = {
	};

	render() {
		const { classes, mobile } = this.props;
		return (
			<Grid item xs={4}>
				<Paper className={classes.paper} elevation={0}>{mobile.name}</Paper>
			</Grid>
		);
	}
}

DashboardMobile.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(DashboardMobile);