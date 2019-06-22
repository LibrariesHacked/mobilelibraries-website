// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

// MUI Icons
import DirectionsIcon from '@material-ui/icons/Directions';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';
import { Breadcrumbs } from '@material-ui/core';

import moment from 'moment';

const styles = theme => ({
	card: {
		minWidth: 275,
		border: '1px solid rgba(0, 0, 0, 0.12)'
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	margin: {
		margin: theme.spacing(2)
	},
	verticalDivider: {
		width: 1,
		height: 28,
		margin: 8
	},
	leftIcon: {
		marginRight: theme.spacing(1),
	},
	title: {
		fontSize: 12,
		fontWeight: 500
	}
});

class MobileCard extends Component {
	state = {
	};

	render() {
		const { classes, mobile, organisation, location } = this.props;
		const bull = <span className={classes.bullet}>•</span>;
		return (
			<Grid item xs={4}>
				<Card className={classes.card} elevation={0}>
					<CardContent>
						<Typography className={classes.title} color="textSecondary" gutterBottom>
							{organisation ? organisation.name : ''}
							{bull}
							{mobile.number_routes + ' route' + (mobile.number_routes > 1 ? 's' : '')}
							{bull}
							{mobile.number_stops + ' stop' + (mobile.number_stops > 1 ? 's' : '')}
						</Typography>
						<Typography variant="h6" component="h2">{mobile.name}</Typography>
						<Breadcrumbs separator="›">
							{
								location && location.previous_stop_id ?
									<Chip size="small" label={location.previous_stop_name} />
									: null
							}
							{
								location && !location.current_stop_id && !location.previous_stop_id & !location.geox ?
									<Chip size="small" color="primary" label="Off Road" />
									: null
							}
							{
								location && !location.current_stop_id && location.previous_stop_id && location.next_stop_id && location.geox ?
									<Chip size="small" color="primary" label="Travelling" />
									: null
							}
							{
								location && location.current_stop_id ?
									<Chip size="small" color="primary" label={location.current_stop_name} />
									: null
							}
							{
								location && location.next_stop_id ?
									<Chip size="small" label={moment(location.next_stop_arrival).format('HH:mma') + ' ' + location.next_stop_name} />
									: null
							}
						</Breadcrumbs>
					</CardContent>
					<Divider variant="middle" />
					<CardActions>
						<Tooltip title="Mobile library stops">
							<Button size="small" color="primary" className={classes.button} onClick={() => this.props.viewStopsByMobile(mobile.id)}>
								<LocationOnIcon className={classes.leftIcon} />Stops
							</Button>
						</Tooltip>
						<Divider className={classes.verticalDivider} />
						<Tooltip title="Download PDF timetable for mobile">
							<IconButton>
								<PictureAsPdfIcon />
							</IconButton>
						</Tooltip>
					</CardActions>
				</Card>
			</Grid>
		);
	}
}

MobileCard.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(MobileCard);