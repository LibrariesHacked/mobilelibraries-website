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
	padding: {
		padding: theme.spacing(0, 2)
	},
	root: {
		flexGrow: 1
	}
});

class Mobiles extends Component {
	state = {
		open_tab: 0
	};

	changeTab = (value) => {
		this.setState({ open_tab: value });
	}

	render() {
		const { classes, organisations, organisationLookup, organisationFilter, setOrganisationFilter, clearOrganisationFilter, viewStopsByOrganisation,
			mobiles, mobileLookup, mobileLocationLookup, mobilesNearestLookup, mobileFilter, setMobileFilter, clearMobileFilter,
			routes, routeLookup, routeFilter, setRouteFilter, clearRouteFilter,
			searchType, postcode, postcode_district, distance, toggleGPS, postcodeSearch, clearSearch, setDistance } = this.props;

		// Get all mobiles that are currently filtered
		const filtered_mobiles = mobiles.filter(mob => {
			let display = true;
			if (searchType === 'gps' || searchType === 'postcode') {
				display = mobilesNearestLookup[mob.id];
			}
			if (organisationFilter.length > 0 &&
				organisationFilter.indexOf(mob.organisationId) === -1) {
				display = false;
			}
			if (mobileFilter.length > 0 &&
				mobileFilter.indexOf(mob.id) === -1) {
				display = false;
			}
			return display;
		});
		// Then get those that are currently active
		const active_mobiles = filtered_mobiles.filter(mob => {
			const status = mobilesHelper.getMobileStatus(mobileLocationLookup[mob.id]);
			return (status && status.type !== 'off_road' && status.type !== 'post_route');
		});

		// Apply filters
		const display_mobiles = (open_tab === 0 ? active_mobiles : filtered_mobiles);

		// Calculate title
		const organisation_name = (organisationFilter.length > 0 ? organisationLookup[organisationFilter[0]].name : '');
		const mobile_name = (mobileFilter.length > 0 ? mobileLookup[mobileFilter[0]].name : '');
		const route_name = (routeFilter.length > 0 ? routeLookup[routeFilter[0]].name : '');
		let title = 'Mobile vans';
		// Filter stops
		if (organisation_name !== '') title = 'Mobiles in ' + organisation_name;
		if (mobile_name !== '') title = organisation_name + ' ' + mobile_name;
		if (route_name !== '') title = organisation_name + ' ' + route_name;
		// Postcode search stops
		if (postcode !== '') title = 'Mobiles with stops within ' + Math.round(distance / 1609) + ' mile(s) of ' + postcode;
		// GPS search stops
		if (searchType === 'gps') title = 'Mobiles with stops within ' + Math.round(distance / 1609) + ' mile(s) of your location';

		return (
			<div className={classes.root}>
				<Filters
					displayStopLink={true}
					organisations={organisations}
					organisationLookup={organisationLookup}
					organisationFilter={organisationFilter}
					setOrganisationFilter={setOrganisationFilter}
					clearOrganisationFilter={clearOrganisationFilter}
					viewStopsByOrganisation={viewStopsByOrganisation}
					mobiles={mobiles}
					mobileLookup={mobileLookup}
					mobileFilter={mobileFilter}
					setMobileFilter={setMobileFilter}
					clearMobileFilter={clearMobileFilter}
					routes={routes}
					routeLookup={routeLookup}
					routeFilter={routeFilter}
					setRouteFilter={setRouteFilter}
					clearRouteFilter={clearRouteFilter}
					postcode={postcode}
					postcode_district={postcode_district}
					distance={distance}
					searchType={searchType}
					setDistance={setDistance}
					toggleGPS={toggleGPS}
					postcodeSearch={postcodeSearch}
					clearSearch={clearSearch}
				/>
				<ListSubheader disableSticky={true}>{title}</ListSubheader>
				<Tabs
					variant="standard"
					scrollButtons="off"
					value={open_tab}
					indicatorColor="secondary"
					textColor="secondary"
					onChange={(e, value) => this.changeTab(value)}
				>
					<Tab
						className={classes.tab}
						label={
							<Badge
								className={classes.padding}
								color={"secondary"}
								badgeContent={active_mobiles.length}>
								Out today
							</Badge>
						}
					/>
					<Tab
						label={
							<Badge
								showZero
								className={classes.padding}
								color="secondary"
								badgeContent={filtered_mobiles.length}>
								All vans
							</Badge>
						}
					/>
				</Tabs>
				<br />
				{mobiles ?
					<Grid container spacing={3}>
						{display_mobiles
							.filter(mob => {
								let display = true;
								if (organisationFilter.length > 0 &&
									organisationFilter.indexOf(mob.organisationId) === -1) {
									display = false;
								}
								if (mobileFilter.length > 0 &&
									mobileFilter.indexOf(mob.id) === -1) {
									display = false;
								}
								return display;
							})
							.filter(mob => {
								if (searchType === 'gps' || searchType === 'postcode') {
									return mobilesNearestLookup[mob.id];
								}
								return true;
							})
							.map((mobile, idx) => {
								return (
									<Grid
										key={'grd_' + mobile.name.replace(' ', '') + '_' + idx}
										item xs={12} sm={6} md={4} lg={3} xl={3}>
										<MobileCard
											mobile={mobile}
											location={mobileLocationLookup[mobile.id]}
											organisation={organisationLookup[mobile.organisationId]}
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