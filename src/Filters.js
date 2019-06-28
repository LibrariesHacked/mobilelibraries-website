// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// Our components
import MobileFilterCard from './MobileFilterCard';
import OrganisationFilterCard from './OrganisationFilterCard';
import RouteFilterCard from './RouteFilterCard';

const styles = (theme) => ({
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	card: {
		position: 'relative',
		minWidth: 275,
		border: '1px solid rgba(0, 0, 0, 0.12)'
	},
	grid: {
		marginBottom: 10
	},
	title: {
		fontSize: 12,
		fontWeight: 500
	}
});

class Filters extends Component {

	state = {
	};

	render() {
		const {
			classes, displayStopLink,
			organisations, organisation_lookup, organisation_filter, setOrganisationFilter,
			clearOrganisationFilter, viewStopsByOrganisation,
			mobiles, mobile_lookup, mobile_filter, setMobileFilter, clearMobileFilter,
			routes, route_lookup, route_filter, setRouteFilter, clearRouteFilter
		} = this.props;
		const bull = <span className={classes.bullet}>•</span>;

		return (
			<Grid className={classes.grid} container spacing={3}>
				<Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
					<Card className={classes.card} elevation={0}>
						<CardContent>
							<Typography className={classes.title} color="textSecondary" gutterBottom>
								{organisations.length + ' library services'}
								{bull}
								{mobiles.length + ' mobile libraries'}
								{bull}
								{routes.length + ' routes'}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		);
	}
}

Filters.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(Filters);