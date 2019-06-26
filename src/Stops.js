// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Paper from '@material-ui/core/Paper';

// Material Table
import MaterialTable from 'material-table';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// MUI Icons
import Event from '@material-ui/icons/Event';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import FirstPage from '@material-ui/icons/FirstPage';
import FilterList from '@material-ui/icons/FilterList';
import LastPage from '@material-ui/icons/LastPage';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

import Filters from './Filters';

import moment from 'moment';

import * as stopsHelper from './helpers/stops';

const styles = (theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 200,
	},
	margin: {
		margin: theme.spacing(1)
	},
	root: {
		flexGrow: 1,
		maxWidth: '100%'
	},
	table: {
		border: '1px solid rgba(0, 0, 0, 0.12)'
	}
});

class Stops extends Component {

	state = {
		title: 'All stops'
	};

	tableRef = React.createRef();

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

	getStopCalendar = (event, rowData) => {

	}

	getStopPdf = (event, rowData) => {

	}

	render() {
		const {
			classes, organisations, organisation_lookup, organisation_filter, viewStopsByOrganisation,
			mobiles, mobile_lookup, mobile_filter,
			routes, route_lookup, route_filter } = this.props;
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
						PreviousPage: ChevronLeft
					}}
					options={{
						search: false,
						loadingType: 'linear',
						actionsColumnIndex: 4,
						filtering: false
					}}
					columns={[
						{ title: 'Name', field: 'name', filtering: false },
						{ title: 'Community', field: 'community', filtering: false },
						{
							title: 'Arrival',
							field: 'arrival',
							filtering: false,
							render: (rowData) => {
								return moment(rowData.arrival, 'HH:mm:ssZ').format('HH:mma');
							}
						},
						{
							title: 'Departure',
							field: 'departure',
							filtering: false,
							render: (rowData) => {
								return moment(rowData.departure, 'HH:mm:ssZ').format('HH:mma');
							}
						}
					]}
					actions={[
						{
							icon: () => <Event color='action' fontSize='small' />,
							iconProps: {
								color: 'primary'
							},
							tooltip: 'Download stop calendar',
							onClick: this.getStopCalendar
						},
						{
							icon: () => <PictureAsPdfIcon color='action' fontSize='small' />,
							iconProps: {
								color: 'primary'
							},
							tooltip: 'Download stop as PDF',
							onClick: this.getStopPdf
						}
					]}
					data={query =>
						new Promise((resolve, reject) => {
							stopsHelper.getQueryStops(query, this.props.organisation_filter, this.props.mobile_filter, this.props.route_filter, stopData => {
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

export default withStyles(styles, { withTheme: true })(Stops);