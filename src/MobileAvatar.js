// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

// MUI Icons
import DirectionBusIcon from '@material-ui/icons/DirectionsBus';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// Helpers
import * as mobilesHelper from './helpers/mobiles';

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
		const { classes, location, mobile } = this.props;
		return (
			<Tooltip
				title={mobilesHelper.getMobileStatus(mobile, location)}>
				<Fab size="small" color="primary" className={classes.fab}>
					<DirectionBusIcon />
				</Fab>
			</Tooltip>
		);
	}
}

MobileAvatar.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(MobileAvatar);