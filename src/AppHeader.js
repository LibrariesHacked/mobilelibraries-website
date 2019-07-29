// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
		backgroundColor: 'rgba(250, 250, 250, 1)'
	},
	appBarTransparent: {
		zIndex: theme.zIndex.drawer + 1,
		backgroundColor: 'rgba(250, 250, 250, 0)'
	},
	button: {
		margin: theme.spacing(1),
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
		margin: theme.spacing(2),
	}
});

class AppHeader extends Component {

	render() {
		const { loading, classes, search_type, postcode, distance, toggleGPS, postcodeSearch, setDistance, page } = this.props;

		return (
			<AppBar
				position="fixed"
				color="inherit"
				elevation={0}
				className={(page === 'map' ? classes.appBarTransparent : classes.appBar)}
			>
				<Toolbar>
					{page !== 'map' ?
						<Hidden xsDown>
							<Typography color="secondary" variant="h6" noWrap>Mobiles</Typography>
						</Hidden>
						: null}
					<div className={classes.grow} />
					{loading ? <CircularProgress className={classes.progress} color="secondary" size={30} /> : null}
					<PostcodeSearch
						postcode={postcode}
						distance={distance}
						search_type={search_type}
						toggleGPS={toggleGPS}
						setDistance={setDistance}
						postcodeSearch={postcodeSearch}
					/>
					<Hidden smDown>
						<React.Fragment>
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
						</React.Fragment>
					</Hidden>
					<Hidden mdUp>
						<React.Fragment>
							<IconButton className={classes.button} onClick={() => this.props.setPage('mobiles')}>
								<DashboardIcon />
							</IconButton>
							<IconButton className={classes.button} onClick={() => this.props.setPage('stops')}>
								<LocationOnIcon />
							</IconButton>
							<IconButton className={classes.button} onClick={() => this.props.setPage('map')}>
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

export default withStyles(styles, { withTheme: true })(AppHeader);