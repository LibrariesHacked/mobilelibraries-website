// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

// MUI Icons
import LocationOnIcon from '@material-ui/icons/LocationOn';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// Helpers
import * as mobilesHelper from './helpers/mobiles';

const styles = theme => ({
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	card: {
		minWidth: 275,
		border: '1px solid rgba(0, 0, 0, 0.12)'
	},
	leftIcon: {
		marginRight: theme.spacing(1)
	},
	title: {
		fontSize: 12,
		fontWeight: 500
	},
	verticalDivider: {
		width: 1,
		height: 28,
		margin: 8
	},
	progress: {
		margin: theme.spacing(2),
	}
});

class MobileCard extends Component {
	state = {
	};

	render() {
		const { classes, mobile, organisation, location } = this.props;
		const status = mobilesHelper.getMobileStatus(mobile, location);
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
					{status ?
						<Chip size="small" color="secondary" label={status} /> :
						<CircularProgress className={classes.progress} color="secondary" size={30} />}
				</CardContent>
				<Divider variant="middle" />
				<CardActions>
					<Tooltip title="Mobile library stops">
						<Button size="small" color="secondary" className={classes.button} onClick={() => this.props.viewStopsByMobile(mobile.id)}>
							<LocationOnIcon className={classes.leftIcon} />Stops
							</Button>
					</Tooltip>
					<Divider className={classes.verticalDivider} />
				</CardActions>
			</Card>
		);
	}
}

MobileCard.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(MobileCard);