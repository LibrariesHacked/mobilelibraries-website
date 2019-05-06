// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	card: {
		minWidth: 275,
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
	},
});

class RouteCard extends Component {
	state = {
	};

	render() {
		const { classes, route } = this.props;
		return (
			<Grid item xs={4}>
				<Card className={classes.card} elevation={0}>
					<CardContent>

					</CardContent>
					<CardActions>
						<Button size="small">Learn More</Button>
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