import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import ListSubheader from '@material-ui/core/ListSubheader';
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
		postcode: this.props.postcode,
		anchor: null
	}

	openSettingsMenu = (e) => this.setState({ anchor: e.currentTarget })
	closeSettingsMenu = () => this.setState({ anchor: null })

	setSearchDistance = (distance) => {
		this.closeSettingsMenu();
		this.props.setDistance(distance);
	}

	render() {
		const { classes, search_type, postcodeSearch, toggleGPS } = this.props;
		return (
			<div className={classes.search}>
				<InputBase
					placeholder="Postcode"
					classes={{
						root: classes.inputRoot,
						input: classes.inputInput,
					}}
					value={this.state.postcode}
					onChange={(e) => this.setState({ postcode: e.target.value })}
				/>
				<Tooltip title={'Search by postcode'}>
					<IconButton
						className={classes.iconButton}
						onClick={() => postcodeSearch(this.state.postcode)}>
						<SearchIcon />
					</IconButton>
				</Tooltip>
				<Divider className={classes.divider} />
				<Tooltip title={'Track my location'}>
					<IconButton
						className={classes.iconButton}
						color="secondary"
						onClick={() => { toggleGPS() }}
					>
						{search_type === 'gps' ? <MyLocationIcon /> : <LocationSearchingIcon />}
					</IconButton>
				</Tooltip>
				<Tooltip title={'Change search settings'}>
					<IconButton
						className={classes.iconButton}
						color="secondary"
						onClick={(e) => { this.openSettingsMenu(e) }}
					>
						<SettingsIcon />
					</IconButton>
				</Tooltip>
				<Menu
					id="mnu-settings"
					anchorEl={this.state.anchor}
					keepMounted
					open={Boolean(this.state.anchor)}
					onClose={() => this.closeSettingsMenu()}
				>
					<ListSubheader disableSticky={true}>Search distance</ListSubheader>
					<MenuItem onClick={() => this.setSearchDistance(1609)}>1 mile</MenuItem>
					<MenuItem onClick={() => this.setSearchDistance(3219)}>2 mile</MenuItem>
					<MenuItem onClick={() => this.setSearchDistance(4828)}>3 mile</MenuItem>
					<MenuItem onClick={() => this.setSearchDistance(8047)}>5 miles</MenuItem>
				</Menu>
			</div>
		);
	}
}

PostcodeSearch.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PostcodeSearch);