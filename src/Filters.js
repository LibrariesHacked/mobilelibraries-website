// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Grid from '@material-ui/core/Grid';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// Our components
import MobileFilterCard from './MobileFilterCard';
import OrganisationFilterCard from './OrganisationFilterCard';
import RouteFilterCard from './RouteFilterCard';

const styles = (theme) => ({
	grid: {
		marginBottom: 10
	}
});

class Filters extends Component {

	state = {
	};

	render() {
		const {
			classes, displayStopLink,
			organisations, organisation_lookup, organisation_filter, setOrganisationFilter, 
			clearOrganisationFilter, viewStopsByOrganisation,
			mobiles, mobile_lookup, mobile_filter, setMobileFilter, clearMobileFilter,
			routes, route_lookup, route_filter, setRouteFilter, clearRouteFilter
		} = this.props;

		return (
			<Grid className={classes.grid} container spacing={3}>
				<Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
					<OrganisationFilterCard
						displayStopLink={displayStopLink}
						organisations={organisations}
						organisation_lookup={organisation_lookup}
						organisation_filter={organisation_filter}
						setOrganisationFilter={setOrganisationFilter}
						clearOrganisationFilter={clearOrganisationFilter}
						viewStopsByOrganisation={viewStopsByOrganisation}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
					<MobileFilterCard
						displayStopLink={displayStopLink}
						organisation_filter={organisation_filter}
						organisation_lookup={organisation_lookup}
						mobiles={mobiles.filter(mob => {
							let display = true;
							if (organisation_filter.length > 0 &&
								organisation_filter.indexOf(mob.organisation_id) === -1) {
								display = false;
							}
							return display;
						})}
						mobile_lookup={mobile_lookup}
						mobile_filter={mobile_filter}
						setMobileFilter={setMobileFilter}
						clearMobileFilter={clearMobileFilter}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
					{mobile_filter.length > 0 ?
						<RouteFilterCard
							displayStopLink={displayStopLink}
							organisation_filter={organisation_filter}
							organisation_lookup={organisation_lookup}
							mobile_lookup={mobile_lookup}
							mobile_filter={mobile_filter}
							routes={routes.filter(route => {
								let display = true;
								if (mobile_filter.length > 0 &&
									mobile_filter.indexOf(route.mobile_id) === -1) {
									display = false;
								}
								return display;
							})}
							route_lookup={route_lookup}
							route_filter={route_filter}
							setRouteFilter={setRouteFilter}
							clearRouteFilter={clearRouteFilter}
						/> : null
					}

				</Grid>
			</Grid>
		);
	}
}

Filters.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(Filters);