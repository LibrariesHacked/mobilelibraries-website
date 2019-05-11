// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// MUI Icons
import EventNoteIcon from '@material-ui/icons/EventNote';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

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
	title: {
		fontSize: 14
	},
	pos: {
		marginBottom: 12
	}
});

class MobileCard extends Component {
	state = {
	};

	render() {
		const { classes, mobile, organisation } = this.props;
		return (
			<Grid item xs={4}>
				<Card className={classes.card} elevation={0}>
					<CardContent>
						<Typography className={classes.title} color="textSecondary" gutterBottom>{organisation ? organisation.name : ''}</Typography>
						<Typography variant="h5" component="h2">{mobile.name}</Typography>
					</CardContent>
					<Divider variant="middle" />
					<CardActions>
						<IconButton aria-label="Number of routes">
							<EventNoteIcon />
						</IconButton>
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