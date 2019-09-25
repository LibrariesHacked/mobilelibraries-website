// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListSubheader from '@material-ui/core/ListSubheader';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// Our components
import Filters from './Filters';
import MobileCard from './MobileCard';

import * as mobilesHelper from './helpers/mobiles';

const styles = (theme) => ({
	chip: {
		margin: theme.spacing(1),
	},
	root: {
		flexGrow: 1
	}
});

class Mobiles extends Component {
	state = {
		on_road: false,
		open_tab: 0
	};

	changeTab = (value) => {
		this.setState({ open_tab: value });
	}

	render() {
		const { classes, organisations, organisation_lookup, organisation_filter, setOrganisationFilter, clearOrganisationFilter, viewStopsByOrganisation,
			mobiles, mobile_lookup, mobile_location_lookup, mobiles_nearest_lookup, mobile_filter, setMobileFilter, clearMobileFilter,
			routes, route_lookup, route_filter, setRouteFilter, clearRouteFilter,
			search_type, postcode, distance, toggleGPS, postcodeSearch, clearSearch, setDistance } = this.props;
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
					postcode={postcode}
					distance={distance}
					search_type={search_type}
					setDistance={setDistance}
					toggleGPS={toggleGPS}
					postcodeSearch={postcodeSearch}
					clearSearch={clearSearch}
				/>
				<ListSubheader disableSticky={true}>Mobile library dashboard</ListSubheader>
				<Tabs
					variant="standard"
					scrollButtons="off"
					value={this.state.open_tab}
					indicatorColor="secondary"
					textColor="secondary"
					onChange={(e, value) => this.changeTab(value)}
				>
					<Tab
						className={classes.tab}
						label={
							<Badge
								className={classes.padding}
								color='default'
								badgeContent={0}>
								All mobiles
							</Badge>
						}
					/>
					<Tab
						className={classes.tab}
						label={
							<Badge
								className={classes.padding}
								color={'default'}
								badgeContent={0}>
								Active today
							</Badge>
						}
					/>
				</Tabs>
				<br />
				{mobiles && mobiles.length > 0 ?
					<Grid container spacing={3}>
						{mobiles
							.filter(mob => {
								let display = true;
								if (this.state.open_tab === 1 && mobile_location_lookup[mob.id]) {
									const status = mobilesHelper.getMobileStatus(mobile_location_lookup[mob.id]);
									display = (status.type !== 'off_road');
								}
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
							.filter(mob => {
								if (search_type === 'gps' || search_type === 'postcode') {
									return mobiles_nearest_lookup[mob.id];
								}
								return true;
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
											viewStop={this.props.viewStop}
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