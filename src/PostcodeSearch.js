import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';

// Material icons
import LocationSearching from '@material-ui/icons/LocationSearching';
import MyLocation from '@material-ui/icons/MyLocation';
import SearchIcon from '@material-ui/icons/Search';

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
		postcode: '',
		distance: 1609
	}

	render() {
		const { classes, gps_available, search_type, postcodeSearch, toggleGPS } = this.props;
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
				<Select
					value={this.state.distance}
					onChange={(e) => { this.setState({ distance: e.target.value }) }}
					input={<InputBase name="sel-miles" id="sel-miles" />}
				>
					<MenuItem value={1609}>1 mi</MenuItem>
					<MenuItem value={3219}>2 mi</MenuItem>
					<MenuItem value={4828}>3 mi</MenuItem>
					<MenuItem value={8047}>5 mi</MenuItem>
				</Select>
				<Tooltip title={'Search by postcode'}>
					<IconButton
						className={classes.iconButton}
						onClick={() => postcodeSearch(this.state.postcode, this.state.distance)}>
						<SearchIcon />
					</IconButton>
				</Tooltip>
				<Divider className={classes.divider} />
				{gps_available ?
					<Tooltip title={'Track my location'}>
						<IconButton
							className={classes.iconButton}
							color="primary"
							onClick={() => { this.setState({ postcode: '' }); toggleGPS() }}
						>
							{gps_available && search_type === 'gps' ? <MyLocation /> : <LocationSearching />}
						</IconButton>
					</Tooltip> : null}
			</div>
		);
	}
}

PostcodeSearch.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PostcodeSearch);