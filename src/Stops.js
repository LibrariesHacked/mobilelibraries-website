// React
import compose from 'recompose/compose';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

// Material UI
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';

// Material Table
import MaterialTable from 'material-table';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// MUI Icons
import ArrowUpward from '@material-ui/icons/ArrowUpwardTwoTone';
import ChevronLeft from '@material-ui/icons/ChevronLeftTwoTone';
import ChevronRight from '@material-ui/icons/ChevronRightTwoTone';
import FirstPage from '@material-ui/icons/FirstPageTwoTone';
import FilterList from '@material-ui/icons/FilterListTwoTone';
import LastPage from '@material-ui/icons/LastPageTwoTone';
import MoreVertIcon from '@material-ui/icons/MoreVertTwoTone';
import EventIcon from '@material-ui/icons/EventTwoTone';
import PrintIcon from '@material-ui/icons/PrintTwoTone';
import LocationOnIcon from '@material-ui/icons/LocationOnTwoTone';

// Our components
import Filters from './Filters';

// Moment
import moment from 'moment';

// Our Helpers
import * as stopsHelper from './helpers/stops';
import { Tooltip } from '@material-ui/core';

const config = require('./helpers/config.json');

const styles = (theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 200
	},
	margin: {
		margin: theme.spacing(1)
	},
	root: {
		flexGrow: 1,
		maxWidth: '100%'
	},
	table: {
		backgroundColor: 'rgba(0, 0, 0, 0)',
		border: '1px solid #E0E0E0'
	}
});

class Stops extends Component {

	tableRef = React.createRef();

	getStopCalendar = (stop) => window.open(config.api + '/stops/' + stop.id + '/ics');
	getStopPdf = (stop) => window.open(config.api + '/stops/' + stop.id + '/pdf', '_blank');
	viewMapStop = (stop) => this.props.viewMapStop(stop.longitude, stop.latitude);
	goToWebsite = (stop) => window.open(stop.timetable, '_blank');

	componentDidUpdate(prevProps) {
		if (this.props.currentPosition !== prevProps.currentPosition || this.props.distance !== prevProps.distance) this.tableRef.current.onQueryChange();
	}

	setOrganisationFilter = (organisationId) => {
		this.props.setOrganisationFilter(organisationId);
		this.tableRef.current.onQueryChange();
	}

	clearOrganisationFilter = () => {
		this.props.clearOrganisationFilter();
		this.tableRef.current.onQueryChange();
	}

	setMobileFilter = (mobileId) => {
		this.props.setMobileFilter(mobileId);
		this.tableRef.current.onQueryChange();
	}

	clearMobileFilter = () => {
		this.props.clearMobileFilter();
		this.tableRef.current.onQueryChange();
	}

	setRouteFilter = (routeId) => {
		this.props.setRouteFilter(routeId);
		this.tableRef.current.onQueryChange();
	}

	clearRouteFilter = () => {
		this.props.clearRouteFilter();
		this.tableRef.current.onQueryChange();
	}

	displayStopInfo = (row) => this.props.viewStop(row);

	render() {
		const {
			classes, organisations, organisationLookup, organisationFilter, viewStopsByOrganisation,
			mobiles, mobileLookup, mobileFilter,
			routes, routeLookup, routeFilter, currentPosition, distance, width,
			searchType, postcode, postcode_district, toggleGPS, postcodeSearch, clearSearch, setDistance } = this.props;

		// Calculate title
		const organisation_name = (organisationFilter.length > 0 ? organisationLookup[organisationFilter[0]].name : '');
		const mobile_name = (mobileFilter.length > 0 ? mobileLookup[mobileFilter[0]].name : '');
		const route_name = (routeFilter.length > 0 ? routeLookup[routeFilter[0]].name : '');
		let title = 'All stops';
		// Filter stops
		if (organisation_name !== '') title = 'Stops in ' + organisation_name;
		if (mobile_name !== '') title = 'Stops for ' + organisation_name + ' ' + mobile_name;
		if (route_name !== '') title = 'Stops for ' + organisation_name + ' ' + route_name;
		// Postcode search stops
		if (postcode !== '') title = 'Stops within ' + Math.round(distance / 1609) + ' mile(s) of ' + postcode;
		// GPS search stops
		if (searchType === 'gps') title = 'Stops within ' + Math.round(distance / 1609) + ' mile(s) of your location';

		let orgText = {}
		Object.keys(organisationLookup).forEach(key => {
			orgText[key] = organisationLookup[key].name;
		});
		let mobileText = {}
		Object.keys(mobileLookup).forEach(key => {
			mobileText[key] = mobileLookup[key].name;
		});
		let routeText = {}
		Object.keys(routeLookup).forEach(key => {
			routeText[key] = routeLookup[key].name;
		});
		return (
			<div style={{ maxWidth: '100%' }}>
				<Filters
					displayStopLink={false}
					organisations={organisations}
					organisationLookup={organisationLookup}
					organisationFilter={organisationFilter}
					setOrganisationFilter={this.setOrganisationFilter}
					clearOrganisationFilter={this.clearOrganisationFilter}
					viewStopsByOrganisation={viewStopsByOrganisation}
					mobiles={mobiles}
					mobileLookup={mobileLookup}
					mobileFilter={mobileFilter}
					setMobileFilter={this.setMobileFilter}
					clearMobileFilter={this.clearMobileFilter}
					routes={routes}
					routeLookup={routeLookup}
					routeFilter={routeFilter}
					setRouteFilter={this.setRouteFilter}
					clearRouteFilter={this.clearRouteFilter}
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
				<MaterialTable
					tableRef={this.tableRef}
					components={{
						Container: props => <Paper {...props} elevation={0} className={classes.table} />
					}}
					icons={{
						Filter: FilterList,
						FirstPage: FirstPage,
						LastPage: LastPage,
						NextPage: ChevronRight,
						PreviousPage: ChevronLeft,
						SortArrow: ArrowUpward
					}}
					options={{
						padding: isWidthUp('sm', width) ? 'default' : 'dense',
						search: false,
						loadingType: 'overlay',
						actionsColumnIndex: 0,
						filtering: false,
						toolbar: false,
						headerStyle: {
							backgroundColor: '#fafafa',
							color: '#737373',
							border: '0px'
						}
					}}
					columns={[
						{
							title: '',
							field: 'name',
							filtering: false,
							render: rowData => {
								return (
									<React.Fragment>
										<Tooltip title="See more stop details">
											<IconButton onClick={() => this.displayStopInfo(rowData)}>
												<MoreVertIcon />
											</IconButton>
										</Tooltip>
										<Hidden mdDown>
											<Tooltip title="Add event to your device calendar">
												<IconButton onClick={() => this.getStopCalendar(rowData)}>
													<EventIcon />
												</IconButton>
											</Tooltip>
										</Hidden>
										<Hidden mdDown>
											<Tooltip title="Download a PDF timetable for this stop">
												<IconButton onClick={() => this.getStopPdf(rowData)}>
													<PrintIcon />
												</IconButton>
											</Tooltip>
										</Hidden>
										<Hidden mdDown>
											<Tooltip title="See this stop on the map">
												<IconButton onClick={() => this.viewMapStop(rowData)} component={Link} to="/map">
													<LocationOnIcon />
												</IconButton>
											</Tooltip>
										</Hidden>
									</React.Fragment>
								)
							},
							cellStyle: {
								borderBottom: '1px solid #f5f5f5',
								backgroundColor: '#ffffff'
							}
						},
						{
							title: 'Name',
							field: 'name',
							filtering: false,
							hidden: false,
							render: rowData => {
								return (
									rowData.name
								)
							},
							cellStyle: {
								borderBottom: '1px solid #f5f5f5',
								backgroundColor: '#ffffff'
							}
						},
						{
							title: 'Community',
							field: 'community',
							filtering: false,
							cellStyle: {
								borderBottom: '1px solid #f5f5f5',
								backgroundColor: '#ffffff'
							}
						},
						{
							title: 'Library service',
							field: 'organisation_name',
							filtering: false,
							hidden: isWidthDown('md', width),
							cellStyle: {
								borderBottom: '1px solid #f5f5f5',
								backgroundColor: '#ffffff'
							}
						},
						{
							title: 'Next due',
							field: 'route_schedule',
							filtering: false,
							hidden: isWidthDown('xs', width),
							render: (rowData) => {
								return (
									rowData.route_schedule.length > 0 ? moment(rowData.route_schedule[0]).format('Do MMMM h:mma') : ''
								);
							},
							cellStyle: {
								borderBottom: '1px solid #f5f5f5',
								backgroundColor: '#ffffff'
							}
						}
					]}
					data={query =>
						new Promise((resolve, reject) => {
							stopsHelper.getQueryStops(query, organisationFilter, mobileFilter, routeFilter, currentPosition, distance, stopData => {
								resolve({
									data: stopData.stops,
									page: (stopData.page - 1),
									totalCount: stopData.total,
								})
							});
						})
					}
				/>
			</div>
		);
	}
}

Stops.propTypes = {
	classes: PropTypes.object.isRequired
}

export default compose(withWidth(), withStyles(styles, { withTheme: true }))(Stops);