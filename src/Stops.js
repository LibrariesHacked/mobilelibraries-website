// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import ListSubheader from '@material-ui/core/ListSubheader';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';

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

	getStopCalendar = (event, rowData) => {

	}

	getStopPdf = (event, rowData) => {

	}

	handleChangeOrganisation = (event) => this.props.setOrganisationFilter(event.target.value);

	render() {
		const { classes, organisation_lookup, mobile_lookup, route_lookup } = this.props;
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
				<ListSubheader>Find stop by postcode</ListSubheader>

				<ListSubheader>Find stop by library service</ListSubheader>
				<FormControl className={classes.formControl}>
					<InputLabel htmlFor="sel-organisation">Library services</InputLabel>
					<Select
						multiple
						value={this.props.organisation_filter}
						renderValue={selected => selected.map(org => this.props.organisation_lookup[org].name).join(', ')}
						onChange={this.handleChangeOrganisation}
						inputProps={{
							name: 'sel-organisation',
							id: 'sel-organisation',
						}}
					>
						{this.props.organisations.map(org => {
							return <MenuItem value={org.id}>
								{org.name}
							</MenuItem>
						})}
					</Select>
				</FormControl>
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
							stopsHelper.getQueryStops(query, stopData => {
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