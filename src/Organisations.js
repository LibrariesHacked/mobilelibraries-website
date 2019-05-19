// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	root: {
		flexGrow: 1
	}
});

class Organisations extends Component {
	state = {
	};

	render() {
		const { classes } = this.props;
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