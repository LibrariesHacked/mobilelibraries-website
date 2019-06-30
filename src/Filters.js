// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// MUI Icons
import BusinessIcon from '@material-ui/icons/Business';

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
	leftIcon: {
		marginRight: theme.spacing(1)
	},
	title: {
		fontSize: 12,
		fontWeight: 500
	}
});

class Filters extends Component {

	state = {
		organisation_menu_anchor: null,
		mobile_menu_anchor: null,
		route_menu_anchor: null
	};

	openOrganisationMenu = (element) => {
		this.setState({ organisation_menu_anchor: element });
	}

	closeOrganisationMenu = () => {
		this.setState({ organisation_menu_anchor: null });
	}

	chooseOrganisation = (organisation_id) => {
		this.props.setOrganisationFilter(organisation_id);
		this.closeOrganisationMenu();
	}

	openMobileMenu = (element) => {
		this.setState({ mobile_menu_anchor: element });
	}

	closeMobileMenu = () => {
		this.setState({ mobile_menu_anchor: null });
	}

	openRouteMenu = (element) => {
		this.setState({ route_menu_anchor: element });
	}

	closeRouteMenu = () => {
		this.setState({ route_menu_anchor: null });
	}

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
						<CardActions>
							<Tooltip title="Choose library service">
								<Button size="small" color="primary" className={classes.button} onClick={(e) => this.openOrganisationMenu(e.currentTarget)}>
									<BusinessIcon className={classes.leftIcon} />Service
								</Button>
							</Tooltip>
						</CardActions>
					</Card>
				</Grid>
				<Menu
					id="menu-library-service"
					anchorEl={this.state.organisation_menu_anchor}
					keepMounted
					open={Boolean(this.state.organisation_menu_anchor)}
					onClose={() => this.closeOrganisationMenu()}
				>
					{organisations.map(org => {
						return <MenuItem key={'mnu_itm_org_' + org.id} onClick={() => this.chooseOrganisation(org.id)}>{org.name}</MenuItem>
					})}
				</Menu>
				<Menu
					id="menu-mobile-library"
					anchorEl={this.state.mobile_menu_anchor}
					keepMounted
					open={Boolean(this.state.mobile_menu_anchor)}
					onClose={() => this.closeMobileMenu()}
				>
					{mobiles
						.filter(mob => {
							let display = true;
							if (organisation_filter.length > 0 &&
								organisation_filter.indexOf(mob.organisation_id) === -1) {
								display = false;
							}
							return display;
						})
						.map(mob => {
							return <MenuItem key={'mnu_itm_mob_' + mob.id} onClick={() => this.chooseMobile(mob.id)}>{mob.name}</MenuItem>
						})}
				</Menu>
				<Menu
					id="menu-route"
					anchorEl={this.state.route_menu_anchor}
					keepMounted
					open={Boolean(this.state.route_menu_anchor)}
					onClose={() => this.closeRouteMenu()}
				>
					{routes.map(route => {
						return <MenuItem key={'mnu_itm_route_' + route.id} onClick={() => this.chooseRoute(route.id)}>{route.name}</MenuItem>
					})}
				</Menu>

			</Grid>
		);
	}
}

Filters.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(Filters);