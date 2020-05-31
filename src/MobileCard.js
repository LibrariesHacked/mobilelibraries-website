// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

// Material UI
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

// MUI Icons
import LocationOnIcon from '@material-ui/icons/LocationOnTwoTone';
import WebIcon from '@material-ui/icons/WebTwoTone';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// Helpers
import * as mobilesHelper from './helpers/mobiles';

const styles = theme => ({
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(1.2)'
	},
	card: {
		minWidth: 275
	},
	leftIcon: {
		marginRight: theme.spacing(1)
	},
	title: {
		fontSize: 12,
		fontWeight: 500,
		align: 'right'
	},
	verticalDivider: {
		width: 1,
		height: 28,
		margin: 8
	},
	progress: {
		margin: theme.spacing(2)
	}
});

class MobileCard extends Component {

	stopButton = (stop) => {
		return <Button color="secondary" onClick={() => this.props.viewStop({ id: stop.stop_id })}>{stop.stop_name}</Button>
	}

	offRoadMessage = (status) => {
		return (
			<Typography>{status.message}</Typography>
		)
	}

	preRouteMessage = (status) => {
		const stop_button = this.stopButton(status.args[0]);
		return (
			<React.Fragment>
				<Typography>
					{status.message}
					{stop_button}
					{status.args[1]}
				</Typography>
			</React.Fragment>
		)
	}

	atStopMessage = (status) => {
		const stop_button = this.stopButton(status.args[0]);
		return (
			<React.Fragment>
				<Typography>
					{status.message}
					{stop_button}
					{' for ' + status.args[1]}
				</Typography>
			</React.Fragment>
		)
	}

	betweenStopsMessage = (status) => {
		const stop_button = this.stopButton(status.args[0]);
		return (
			<React.Fragment>
				<Typography>
					{status.message}
					{stop_button}
					{status.args[1]}
				</Typography>
			</React.Fragment>
		)
	}

	postRouteMessage = (status) => {
		return (
			<Typography>{status.message}</Typography>
		)
	}

	goToWebsite = () => window.open(this.props.mobile.timetable, '_blank');

	render() {
		const { classes, mobile, organisation, location } = this.props;
		let status = mobilesHelper.getMobileStatus(location);
		if (status && status.type === 'off_road') status = this.offRoadMessage(status);
		if (status && status.type === 'pre_route') status = this.preRouteMessage(status);
		if (status && status.type === 'at_stop') status = this.atStopMessage(status);
		if (status && status.type === 'between_stops') status = this.betweenStopsMessage(status);
		if (status && status.type === 'post_route') status = this.postRouteMessage(status);
		if (!status) status = <CircularProgress className={classes.progress} color="secondary" size={30} />
		const bull = <span className={classes.bullet}>•</span>;
		return (
			<Card className={classes.card} elevation={0}>
				<CardContent>
					<Typography className={classes.title} color="textSecondary" gutterBottom>
						{mobile.number_routes + ' route' + (mobile.number_routes > 1 ? 's' : '')}
						{bull}
						{mobile.number_stops + ' stop' + (mobile.number_stops > 1 ? 's' : '')}
					</Typography>
					<Typography variant="h6" component="h2">{(organisation ? organisation.name + ' ' : '') + mobile.name}</Typography>
					{status}
				</CardContent>
				<CardActions>
					<Tooltip title="Mobile library stops">
						<Button component={Link} to="/stops" size="small" color="primary" className={classes.button} onClick={() => this.props.viewStopsByMobile(organisation.id, mobile.id)}>
							<LocationOnIcon className={classes.leftIcon} />Stops
						</Button>
					</Tooltip>
					<Divider className={classes.verticalDivider} />
					{mobile.timetable ? <Tooltip title="Website timetable">
						<IconButton className={classes.button} onClick={() => this.goToWebsite()}>
							<WebIcon />
						</IconButton>
					</Tooltip> : null}
				</CardActions>
			</Card>
		);
	}
}

MobileCard.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(MobileCard);