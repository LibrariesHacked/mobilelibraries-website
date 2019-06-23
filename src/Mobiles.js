// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Grid from '@material-ui/core/Grid';
import ListSubheader from '@material-ui/core/ListSubheader';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

import MobileCard from './MobileCard';

const styles = () => ({
	root: {
		flexGrow: 1
	}
});

class Dashboard extends Component {
	state = {
	};

	render() {
		const { classes, mobiles, organisation_lookup, mobile_location_lookup } = this.props;
		return (
			<div className={classes.root}>
				<ListSubheader>Mobile libraries</ListSubheader>
				<Grid container spacing={3}>
					{mobiles.map((mobile, idx) => {
						return (
							<MobileCard
								key={'crd_' + mobile.name.replace(' ', '') + '_' + idx}
								mobile={mobile}
								location={mobile_location_lookup[mobile.id]}
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

export default withStyles(styles)(Dashboard);