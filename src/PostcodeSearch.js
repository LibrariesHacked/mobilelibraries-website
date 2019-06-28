import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
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
		postcode: ''
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
				<Tooltip title={'Search by postcode'}>
					<IconButton
						className={classes.iconButton}
						onClick={() => postcodeSearch(this.state.postcode)}>
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