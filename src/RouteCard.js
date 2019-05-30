// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// MUI Icons
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

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

class RouteCard extends Component {
	state = {
	};

	render() {
		const { classes, route, organisation, mobile } = this.props;
		return (
			<Grid item xs={4}>
				<Card className={classes.card} elevation={0}>
					<CardContent>
						<Typography className={classes.title} color="textSecondary" gutterBottom>
							{organisation ? organisation.name + ' ' : ''}
							{mobile ?  mobile.name : ''}
						</Typography>
						<Typography variant="h6" component="h2">{route.name}</Typography>
					</CardContent>
					<Divider variant="middle" />
					<CardActions>
						<Tooltip title="Route stops">
							<Badge color="primary" badgeContent={route.number_stops} className={classes.margin}>
								<Button size="small" color="primary" className={classes.button} onClick={() => this.props.viewStopsByRoute(route.id)}>
									<LocationOnIcon className={classes.leftIcon} />Stops
								</Button>
							</Badge>
						</Tooltip>
						<Divider className={classes.verticalDivider} />
						<Tooltip title="Download PDF timetable for route">
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

RouteCard.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(RouteCard);