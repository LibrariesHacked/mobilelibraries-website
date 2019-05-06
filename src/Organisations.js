// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Grid from '@material-ui/core/Grid';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';
import OrganisationCard from './OrganisationCard';

const styles = theme => ({
	root: {
		flexGrow: 1
	}
});

class Organisations extends Component {
	state = {
	};

	render() {
		const { classes, organisations } = this.props;
		return (
			<div className={classes.root}>

			</div>
		);
	}
}

Organisations.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(Organisations);