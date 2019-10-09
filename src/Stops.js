// React
import compose from 'recompose/compose';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

// Material Table
import MaterialTable from 'material-table';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// MUI Icons
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import FirstPage from '@material-ui/icons/FirstPage';
import FilterList from '@material-ui/icons/FilterList';
import LastPage from '@material-ui/icons/LastPage';

// Our components
import Filters from './Filters';

// Moment
import moment from 'moment';

// Our Helpers
import * as stopsHelper from './helpers/stops';


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
		border: '1px solid #F5F5F5'
	}
});

class Stops extends Component {

	state = {
		title: 'All stops'
	};

	tableRef = React.createRef();

	componentDidUpdate(prevProps) {
		if (this.props.current_position !== prevProps.current_position || this.props.distance !== prevProps.distance) this.tableRef.current.onQueryChange();
	}

	setOrganisationFilter = (organisation_id) => {
		this.props.setOrganisationFilter(organisation_id);
		this.tableRef.current.onQueryChange();
	}

	clearOrganisationFilter = () => {
		this.props.clearOrganisationFilter();
		this.tableRef.current.onQueryChange();
	}

	setMobileFilter = (mobile_id) => {
		this.props.setMobileFilter(mobile_id);
		this.tableRef.current.onQueryChange();
	}

	clearMobileFilter = () => {
		this.props.clearMobileFilter();
		this.tableRef.current.onQueryChange();
	}

	setRouteFilter = (route_id) => {
		this.props.setRouteFilter(route_id);
		this.tableRef.current.onQueryChange();
	}

	clearRouteFilter = () => {
		this.props.clearRouteFilter();
		this.tableRef.current.onQueryChange();
	}

	displayStopInfo = (row) => this.props.viewStop(row);

	render() {
		const {
			classes, organisations, organisation_lookup, organisation_filter, viewStopsByOrganisation,
			mobiles, mobile_lookup, mobile_filter,
			routes, route_lookup, route_filter, current_position, distance, width,
			search_type, postcode, postcode_district, toggleGPS, postcodeSearch, clearSearch, setDistance } = this.props;
		let orgText = {}
		Object.keys(organisation_lookup).forEach(key => {
			orgText[key] = organisation_lookup[key].name;
		});
		let mobileText = {}
		Object.keys(mobile_lookup).forEach(key => {
			mobileText[key] = mobile_lookup[key].name;
		});
		let routeText = {}
		Object.keys(route_lookup).forEach(key => {
			routeText[key] = route_lookup[key].name;
		});
		return (
			<div style={{ maxWidth: '100%' }}>
				<Filters
					displayStopLink={false}
					organisations={organisations}
					organisation_lookup={organisation_lookup}
					organisation_filter={organisation_filter}
					setOrganisationFilter={this.setOrganisationFilter}
					clearOrganisationFilter={this.clearOrganisationFilter}
					viewStopsByOrganisation={viewStopsByOrganisation}
					mobiles={mobiles}
					mobile_lookup={mobile_lookup}
					mobile_filter={mobile_filter}
					setMobileFilter={this.setMobileFilter}
					clearMobileFilter={this.clearMobileFilter}
					routes={routes}
					route_lookup={route_lookup}
					route_filter={route_filter}
					setRouteFilter={this.setRouteFilter}
					clearRouteFilter={this.clearRouteFilter}
					postcode={postcode}
					postcode_district={postcode_district}
					distance={distance}
					search_type={search_type}
					setDistance={setDistance}
					toggleGPS={toggleGPS}
					postcodeSearch={postcodeSearch}
					clearSearch={clearSearch}
				/>
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
						loadingType: 'linear',
						actionsColumnIndex: 4,
						filtering: false,
						headerStyle: {
							backgroundColor: '#2196f3',
							color: '#ffffff'
						}
					}}
					columns={[
						{
							title: 'Name',
							field: 'name', filtering: false,
							render: rowData => {
								return (
									<React.Fragment>
										<Link component="button" variant="body2" onClick={() => this.displayStopInfo(rowData)}>{rowData.name}</Link>
									</React.Fragment>
								)
							}
						},
						{ title: 'Community', field: 'community', filtering: false },
						{
							title: 'Time',
							field: 'arrival',
							filtering: false,
							render: (rowData) => {
								return (
									moment(rowData.arrival, 'HH:mm:ssZ').format('h:mma')
								);
							}
						}
					]}
					data={query =>
						new Promise((resolve, reject) => {
							stopsHelper.getQueryStops(query, organisation_filter, mobile_filter, route_filter, current_position, distance, stopData => {
								resolve({
									data: stopData.stops,
									page: (stopData.page - 1),
									totalCount: stopData.total,
								})
							});
						})
					}
					title={this.state.title}
				/>
			</div>
		);
	}
}

Stops.propTypes = {
	classes: PropTypes.object.isRequired
}

export default compose(withWidth(), withStyles(styles, { withTheme: true }))(Stops);