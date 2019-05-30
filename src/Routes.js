// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Grid from '@material-ui/core/Grid';
import ListSubheader from '@material-ui/core/ListSubheader';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

import RouteCard from './RouteCard';

const styles = theme => ({
	root: {
		flexGrow: 1
	}
});

class Routes extends Component {
	state = {
	};

	render() {
		const { classes, routes, organisation_lookup, mobile_lookup } = this.props;
		return (
			<div className={classes.root}>
				<ListSubheader>List of mobile library routes</ListSubheader>
				<Grid container spacing={3}>
					{routes.map((route, idx) => {
						return (
							<RouteCard
								key={'dsm_' + route.name.replace(' ', '') + '_' + idx}
								route={route}
								organisation={organisation_lookup[route.organisation_id]}
								mobile={mobile_lookup[route.mobile_id]}
								viewStopsByRoute={this.props.viewStopsByRoute}
							/>
						)
					})}
				</Grid>
			</div>
		);
	}
}

Routes.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(Routes);