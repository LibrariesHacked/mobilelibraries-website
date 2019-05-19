// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';

// Material Table
import MaterialTable from 'material-table';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// MUI Icons
import Event from '@material-ui/icons/Event';
import Search from '@material-ui/icons/Search';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import Remove from '@material-ui/icons/Remove';

import moment from 'moment';

import * as stopsHelper from './helpers/stops';

const styles = theme => ({
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

	handleAddStopCalendar = (event, rowData) => {

	}

	handleStopPdf = (event, rowData) => {

	}

	render() {
		const { classes } = this.props;
		return (
			<div style={{ maxWidth: '100%' }}>
				<ListSubheader>List of mobile library stops</ListSubheader>
				<MaterialTable
					components={{
						Container: props => <Paper {...props} elevation={0} className={classes.table} />
					}}
					icons={{
						FirstPage: FirstPage,
						LastPage: LastPage,
						NextPage: ChevronRight,
						PreviousPage: ChevronLeft,
						Search: Search,
						ThirdStateCheck: Remove
					}}
					options={{
						search: false,
						loadingType: 'linear',
						actionsColumnIndex: 4
					}}
					columns={[
						{ title: 'Name', field: 'name' },
						{ title: 'Community', field: 'community' },
						{
							title: 'Arrival',
							field: 'arrival',
							render: (rowData) => {
								return moment(rowData.arrival, 'HH:mm:ssZ').format('HH:mma');
							}
						},
						{
							title: 'Departure',
							field: 'departure',
							render: (rowData) => {
								return moment(rowData.departure, 'HH:mm:ssZ').format('HH:mma');
							}
						},
						{
							title: 'Next visit',
							field: 'arrival',
							render: (rowData) => {
								return moment(rowData.arrival, 'HH:mm:ssZ').format('HH:mm');
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
							onClick: this.handleAddStopCalendar
						},
						{
							icon: () => <PictureAsPdfIcon color='action' fontSize='small' />,
							iconProps: {
								color: 'primary'
							},
							tooltip: 'Download stop as PDF',
							onClick: this.handleStopPdf
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