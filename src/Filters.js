// React
import React, { Component } from 'react';

// Other core stuff
import PropTypes from 'prop-types';

// Material UI
import { Alert, AlertTitle } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// MUI Icons
import BusinessIcon from '@material-ui/icons/BusinessTwoTone';
import DirectionBusIcon from '@material-ui/icons/DirectionsBusTwoTone';
import DirectionsIcon from '@material-ui/icons/DirectionsTwoTone';

// Our components
import PostcodeSearch from './PostcodeSearch';

const styles = (theme) => ({
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	card: {
		position: 'relative',
		minWidth: 275,
		border: '1px solid #E0E0E0'
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
		this.props.clearSearch();
		this.props.setOrganisationFilter(organisation_id);
		this.closeOrganisationMenu();
	}

	openMobileMenu = (element) => {
		this.setState({ mobile_menu_anchor: element });
	}

	closeMobileMenu = () => {
		this.setState({ mobile_menu_anchor: null });
	}

	chooseMobile = (mobile_id) => {
		this.props.setMobileFilter(mobile_id);
		this.closeMobileMenu();
	}

	openRouteMenu = (element) => {
		this.setState({ route_menu_anchor: element });
	}

	closeRouteMenu = () => {
		this.setState({ route_menu_anchor: null });
	}

	chooseRoute = (route_id) => {
		this.props.setRouteFilter(route_id);
		this.closeRouteMenu();
	}

	render() {
		const {
			classes, organisations, organisation_lookup, organisation_filter,
			clearOrganisationFilter, mobiles, mobile_lookup, mobile_filter, clearMobileFilter,
			routes, route_lookup, route_filter, clearRouteFilter,
			search_type, postcode, postcode_district, distance, toggleGPS, postcodeSearch, clearSearch, setDistance
		} = this.props;
		const bull = <span className={classes.bullet}>•</span>;
		const countries = new Set(organisations.map(org => org.country));

		return (
			<Grid className={classes.grid} container spacing={3}>
				<Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
				<Alert severity="warning">
					<AlertTitle>In development</AlertTitle>
					While this site is being developed you may see unexpected behaviour.
				</Alert>
				</Grid>
				<Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
					<Card className={classes.card} elevation={0}>
						<CardContent>
							<Typography className={classes.title} color="textSecondary" gutterBottom>
								{Math.round(distance / 1609) + ' mile radius'}
								{bull}
								{'GPS tracking ' + (search_type === 'gps' ? 'on' : 'off')}
							</Typography>
							<Typography variant="h6" component="h2" gutterBottom>Search by location</Typography>
							<PostcodeSearch
								postcode={postcode}
								distance={distance}
								search_type={search_type}
								toggleGPS={toggleGPS}
								setDistance={setDistance}
								postcodeSearch={postcodeSearch}
								clearSearch={clearSearch}
							/>
							{postcode_district !== '' ?
								<Typography variant="caption" display="block">{'Searching around ' + postcode_district + '.'}</Typography>
								: null}
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
					<Card className={classes.card} elevation={0}>
						<CardContent>
							<Typography className={classes.title} color="textSecondary" gutterBottom>
								{organisations.length + ' library services'}
								{bull}
								{mobiles.length + ' mobile libraries'}
								{bull}
								{routes.length + ' routes'}
							</Typography>
							<Typography variant="h6" component="h2">Search by service</Typography>
						</CardContent>
						<CardActions>
							{organisation_filter.length === 0 ? <Tooltip title="Choose library service">
								<Button size="small" color="primary" className={classes.button} onClick={(e) => this.openOrganisationMenu(e.currentTarget)}>
									<BusinessIcon className={classes.leftIcon} />Service
								</Button>
							</Tooltip> :
								<Chip size="small" color="secondary" onDelete={clearOrganisationFilter} label={organisation_lookup[organisation_filter[0]].name} />
							}
							{organisation_filter.length > 0 ?
								(mobile_filter.length === 0 ?
									<Tooltip title="Choose mobile library">
										<Button size="small" color="primary" className={classes.button} onClick={(e) => this.openMobileMenu(e.currentTarget)}>
											<DirectionBusIcon className={classes.leftIcon} />Mobile
										</Button>
									</Tooltip> :
									<Chip size="small" color="secondary" onDelete={(e) => clearMobileFilter()} label={mobile_lookup[mobile_filter[0]].name} />
								)
								: null}
							{mobile_filter.length > 0 ?
								(route_filter.length === 0 ?
									<Tooltip title="Choose route">
										<Button size="small" color="primary" className={classes.button} onClick={(e) => this.openRouteMenu(e.currentTarget)}>
											<DirectionsIcon className={classes.leftIcon} />Route
										</Button>
									</Tooltip> :
									<Chip size="small" color="secondary" onDelete={(e) => clearRouteFilter()} label={route_lookup[route_filter[0]].name} />
								)
								: null}
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

					{
						Array.from(countries)
							.sort((a, b) => a.localeCompare(b))
							.map(country => {
								let menu_items = [<ListSubheader disableSticky={true}>{country}</ListSubheader>];
								const org_list = organisations
									.sort((a, b) => a.name.localeCompare(b.name))
									.filter(org => org.country === country)
									.map(org => {
										return <MenuItem key={'mnu_itm_org_' + org.id} onClick={() => this.chooseOrganisation(org.id)}>{org.name}</MenuItem>
									})
								return menu_items.concat(org_list);
							})
					}
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
						.sort((a, b) => a.name.localeCompare(b.name))
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
					{routes
						.filter(route => {
							let display = true;
							if (mobile_filter.length > 0 &&
								mobile_filter.indexOf(route.mobile_id) === -1) {
								display = false;
							}
							return display;
						})
						.sort((a, b) => a.name.localeCompare(b.name))
						.map(route => {
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