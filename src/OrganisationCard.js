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

// MUI Icons
import DirectionsIcon from '@material-ui/icons/Directions';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
		fontWeight: 500
	},
	card: {
		minWidth: 275,
		border: '1px solid rgba(0, 0, 0, 0.12)'
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
	pos: {
		marginBottom: 12,
	},
	title: {
		fontSize: 12,
		fontWeight: 500
	}
});

class OrganisationCard extends Component {
	state = {
	};

	render() {
		const { classes, organisation } = this.props;
		const bull = <span className={classes.bullet}>•</span>;
		return (
			<Grid item xs={4}>
				<Card className={classes.card} elevation={0}>
					<CardContent>
						<Typography className={classes.title} color="textSecondary" gutterBottom>Scotland</Typography>
						<Typography variant="h6" component="h2">{organisation.name}</Typography>
						<Typography className={classes.pos} color="textSecondary">
							{organisation.number_mobiles + ' mobile' + (organisation.number_mobiles > 1 ? 's' : '')}
							{bull}
							{organisation.number_routes + ' route' + (organisation.number_routes > 1 ? 's' : '')}
							{bull}
							{organisation.number_stops + ' stop' + (organisation.number_stops > 1 ? 's' : '')}
						</Typography>
					</CardContent>
					<CardActions>
						<Tooltip title="Mobile library stops">
							<Button size="small" color="primary" className={classes.button} onClick={() => this.props.viewStopsByOrganisation(organisation.id)}>
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

OrganisationCard.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(OrganisationCard);