// React
import React, { Component } from 'react';

// Other core stuff
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { Link, withRouter } from "react-router-dom";

// Material UI
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
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
		borderBottom: '1px solid #F5F5F5'
	},
	appBarTransparent: {
		zIndex: theme.zIndex.drawer + 1,
		backgroundColor: 'rgba(250, 250, 250, 0.5)',
		borderBottom: '1px solid #F5F5F5'
	},
	grow: {
		flexGrow: 1
	},
	hide: {
		display: 'none'
	},
	leftIcon: {
		marginRight: theme.spacing(1)
	},
	progress: {
		margin: theme.spacing(1)
	}
});

class AppHeader extends Component {

	render() {
		const { loading, classes, search_type, postcode, distance, toggleGPS, postcodeSearch, clearSearch, setDistance, location } = this.props;
		return (
			<AppBar
				position="fixed"
				color="inherit"
				elevation={0}
				className={(location.pathname === '/map' ? classes.appBarTransparent : classes.appBar)}
			>
				<Toolbar>
					{location.pathname !== '/map' ?
						<Hidden xsDown>
							<Typography variant="h6" color="error" noWrap>In development</Typography>
						</Hidden>
						: null}
					<div className={classes.grow} />
					{loading ? <CircularProgress className={classes.progress} color="secondary" size={30} /> : null}
					{location.pathname === '/map' ?
						<PostcodeSearch
							postcode={postcode}
							distance={distance}
							search_type={search_type}
							toggleGPS={toggleGPS}
							setDistance={setDistance}
							postcodeSearch={postcodeSearch}
							clearSearch={clearSearch}
						/> : null}
					<Hidden smDown>
						<React.Fragment>
							<Button component={Link} to="/" color="secondary"
								onClick={() => { }}
							>
								<DashboardIcon className={classes.leftIcon} />Mobiles
							</Button>
							<Button component={Link} to="/stops" color="secondary"
								onClick={() => { }}
							>
								<LocationOnIcon className={classes.leftIcon} />Stops
							</Button>
							<Button component={Link} to="/map" color="secondary"
								onClick={() => { }}
							>
								<MapIcon className={classes.leftIcon} />Map
							</Button>
						</React.Fragment>
					</Hidden>
					<Hidden mdUp>
						<React.Fragment>
							<IconButton component={Link} to="/" onClick={() => { }}>
								<DashboardIcon />
							</IconButton>
							<IconButton component={Link} to="/stops" onClick={() => { }}>
								<LocationOnIcon />
							</IconButton>
							<IconButton component={Link} to="/map" onClick={() => { }}>
								<MapIcon />
							</IconButton>
						</React.Fragment>
					</Hidden>
				</Toolbar>
			</AppBar>
		);
	}
}

AppHeader.propTypes = {
	classes: PropTypes.object.isRequired
}

export default compose(withRouter, withStyles(styles, { withTheme: true }))(AppHeader);