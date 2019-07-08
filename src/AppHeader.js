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

// Our components
import PostcodeSearch from './PostcodeSearch';

const styles = theme => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		backgroundColor: 'rgba(255, 255, 255, 0)'
	},
	grow: {
		flexGrow: 1
	},
	hide: {
		display: 'none'
	},
	leftIcon: {
		marginRight: theme.spacing(1)
	}
});

class AppHeader extends Component {

	render() {
		const { classes, drawer_open, search_type, gps_available, toggleGPS, postcodeSearch } = this.props;

		return (
			<AppBar
				position="fixed"
				color="inherit"
				elevation={0}
				className={clsx(classes.appBar, {
					[classes.appBarShift]: drawer_open
				})}
			>
				<Toolbar>
					<Typography variant="h6" noWrap>Mobile Libraries</Typography>
					<div className={classes.grow} />
					<PostcodeSearch
						search_type={search_type}
						gps_available={gps_available}
						toggleGPS={toggleGPS}
						postcodeSearch={postcodeSearch}
					/>
					<Button color="secondary" variant={this.props.page === 'mobiles' ? 'text' : 'text'}
						onClick={() => this.props.setPage('mobiles')}
					>
						<DashboardIcon className={classes.leftIcon} />Mobile dashboard
					</Button>
					<Button color="secondary" variant={this.props.page === 'stops' ? 'text' : 'text'}
						onClick={() => this.props.setPage('stops')}
					>
						<LocationOnIcon className={classes.leftIcon} />Find a stop
					</Button>
					<Button color="secondary" variant={this.props.page === 'map' ? 'text' : 'text'}
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