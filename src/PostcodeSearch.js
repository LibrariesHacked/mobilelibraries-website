import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';

// Material icons
import LocationSearchingIcon from '@material-ui/icons/LocationSearching';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';

const styles = theme => ({
	divider: {
		width: 1,
		height: 28,
		margin: 8
	},
	iconButton: {
		padding: 10
	},
	inputRoot: {
		color: 'inherit'
	},
	inputInput: {
		paddingTop: theme.spacing(),
		paddingRight: theme.spacing(),
		paddingBottom: theme.spacing(),
		paddingLeft: theme.spacing(2),
		width: 100
	},
	search: {
		position: 'relative',
		border: '1px solid #e5e5e5',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.8),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.9),
		},
		marginLeft: 0,
		marginRight: theme.spacing(),
		display: 'flex'
	}
});

class PostcodeSearch extends React.Component {
	state = {
		anchor: null
	}

	render() {
		const { classes, gps_available, search_type, postcode, distance, postcodeSearch, setDistance, setPostcode, toggleGPS } = this.props;
		return (
			<div className={classes.search}>
				<InputBase
					placeholder="Postcode"
					classes={{
						root: classes.inputRoot,
						input: classes.inputInput,
					}}
					value={this.state.postcode}
					onChange={(e) => setPostcode(e.target.value)}
				/>
				<Tooltip title={'Track my location'}>
					<IconButton
						className={classes.iconButton}
						color="secondary"
						onClick={() => { }}
					>
						<SettingsIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title={'Search by postcode'}>
					<IconButton
						className={classes.iconButton}
						onClick={() => postcodeSearch(postcode, distance)}>
						<SearchIcon />
					</IconButton>
				</Tooltip>
				<Divider className={classes.divider} />
				{gps_available ?
					<Tooltip title={'Track my location'}>
						<IconButton
							className={classes.iconButton}
							color="secondary"
							onClick={() => { setPostcode(''); toggleGPS() }}
						>
							{gps_available && search_type === 'gps' ? <MyLocationIcon /> : <LocationSearchingIcon />}
						</IconButton>
					</Tooltip> : null}
				<Menu
					id="mnu-distances"
					anchorEl={this.state.anchor}
					keepMounted
					open={Boolean(this.state.anchor)}
					onClose={() => this.setState({ anchor: null })}
				>
					<MenuItem onClick={() => setDistance(1609)}>1 mile</MenuItem>
					<MenuItem onClick={() => setDistance(3219)}>2 mile</MenuItem>
					<MenuItem onClick={() => setDistance(4828)}>3 mile</MenuItem>
					<MenuItem onClick={() => setDistance(8047)}>5 miles</MenuItem>
				</Menu>
			</div>
		);
	}
}

PostcodeSearch.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PostcodeSearch);