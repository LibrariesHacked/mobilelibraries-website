// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Grid from '@material-ui/core/Grid';
import ListSubheader from '@material-ui/core/ListSubheader';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';
import MobileCard from './MobileCard';

const styles = theme => ({
	root: {
		flexGrow: 1
	}
});

class Dashboard extends Component {
	state = {
	};

	render() {
		const { classes, mobiles, organisation_lookup } = this.props;
		return (
			<div className={classes.root}>
				<ListSubheader>List of mobile libraries</ListSubheader>
				<Grid container spacing={3}>
					{mobiles.map((mobile, idx) => {
						return (
							<MobileCard
								key={'dsm_' + mobile.name.replace(' ', '') + '_' + idx}
								mobile={mobile}
								organisation={organisation_lookup[mobile.organisation_id]}
								viewStopsByMobile={this.props.viewStopsByMobile}
							/>
						)
					})}
				</Grid>
			</div>
		);
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(Dashboard);