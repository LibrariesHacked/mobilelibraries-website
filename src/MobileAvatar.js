// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Fab from '@material-ui/core/Fab';

// MUI Icons
import DirectionBusIcon from '@material-ui/icons/DirectionsBus';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	fab: {
		margin: theme.spacing(1),
		boxShadow: 'none'
	}
});

class MobileAvatar extends Component {
	state = {
	};

	render() {
		const { classes } = this.props;
		return (
			<Fab size="small" color="primary" className={classes.fab}>
				<DirectionBusIcon />
			</Fab>
		);
	}
}

MobileAvatar.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(MobileAvatar);