// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListSubheader from '@material-ui/core/ListSubheader';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// Our components
import Filters from './Filters';
import MobileCard from './MobileCard';

const styles = () => ({
	root: {
		flexGrow: 1
	}
});

class Mobiles extends Component {
	state = {
	};

	render() {
		const { classes, organisations, organisation_lookup, organisation_filter, setOrganisationFilter, clearOrganisationFilter, viewStopsByOrganisation,
			mobiles, mobile_lookup, mobile_location_lookup, mobile_filter, setMobileFilter, clearMobileFilter,
			routes, route_lookup, route_filter, setRouteFilter, clearRouteFilter } = this.props;
		return (
			<div className={classes.root}>
				<Filters
					displayStopLink={true}
					organisations={organisations}
					organisation_lookup={organisation_lookup}
					organisation_filter={organisation_filter}
					setOrganisationFilter={setOrganisationFilter}
					clearOrganisationFilter={clearOrganisationFilter}
					viewStopsByOrganisation={viewStopsByOrganisation}
					mobiles={mobiles}
					mobile_lookup={mobile_lookup}
					mobile_filter={mobile_filter}
					setMobileFilter={setMobileFilter}
					clearMobileFilter={clearMobileFilter}
					routes={routes}
					route_lookup={route_lookup}
					route_filter={route_filter}
					setRouteFilter={setRouteFilter}
					clearRouteFilter={clearRouteFilter}
				/>
				<ListSubheader disableSticky={true}>Mobile library dashboard</ListSubheader>
				{mobiles && mobiles.length > 0 ?
					<Grid container spacing={3}>
						{mobiles
							.filter(mob => {
								let display = true;
								if (organisation_filter.length > 0 &&
									organisation_filter.indexOf(mob.organisation_id) === -1) {
									display = false;
								}
								if (mobile_filter.length > 0 &&
									mobile_filter.indexOf(mob.id) === -1) {
									display = false;
								}
								return display;
							})
							.map((mobile, idx) => {
								return (
									<Grid
										key={'grd_' + mobile.name.replace(' ', '') + '_' + idx}
										item xs={12} sm={6} md={4} lg={3} xl={2}>
										<MobileCard
											mobile={mobile}
											location={mobile_location_lookup[mobile.id]}
											organisation={organisation_lookup[mobile.organisation_id]}
											viewStopsByMobile={this.props.viewStopsByMobile}
										/>
									</Grid>
								)
							})}
					</Grid> :
					<div>
						<br />
						<LinearProgress color="secondary" />
					</div>}
			</div>
		);
	}
}

Mobiles.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Mobiles);