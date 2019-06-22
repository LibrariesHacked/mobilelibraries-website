// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// Material UI
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// Material Icons
import DashboardIcon from '@material-ui/icons/Dashboard';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MapIcon from '@material-ui/icons/Map';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		backgroundColor: '#fafafa'
	},
	grow: {
		flexGrow: 1,
	},
	hide: {
		display: 'none'
	},
	leftIcon: {
		marginRight: theme.spacing(1),
	}
});

class AppHeader extends Component {

	render() {
		const { classes, drawer_open } = this.props;

		return (
			<AppBar
				position="fixed"
				color="inherit"
				elevation={0}
				className={clsx(classes.appBar, {
					[classes.appBarShift]: drawer_open,
				})}
			>
				<Toolbar>
					<Typography variant="h6" color="inherit" noWrap>Mobile Libraries</Typography>
					<div className={classes.grow} />
					<Button color="primary"
						onClick={() => this.props.setPage('mobiles')}
					>
						<DashboardIcon className={classes.leftIcon} />Mobile dashboard
					</Button>
					<Button color="primary"
						onClick={() => this.props.setPage('stops')}
					>
						<LocationOnIcon className={classes.leftIcon} />Find a stop
					</Button>
					<Button color="primary"
						onClick={() => this.props.setPage('map')}
					>
						<MapIcon className={classes.leftIcon} />Map
					</Button>
				</Toolbar>
			</AppBar>
		);
	}
}

AppHeader.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(AppHeader);