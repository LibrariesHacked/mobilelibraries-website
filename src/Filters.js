// React
import React, { Component } from 'react';

// Other core stuff
import PropTypes from 'prop-types';

// Material UI
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
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
	button: {
		marginRight: theme.spacing(1)
	},
	chip: {
		marginRight: theme.spacing(1)
	},
	leftIcon: {
		marginRight: theme.spacing(1)
	},
	search: {
		alignContent: 'center',
		textAlign: 'center',
		display: 'table',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginBottom: '10px'
	},
	subtitle: {
		textAlign: 'center',
		marginBottom: '5px'
	},
	title: {
		textAlign: 'center'
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

	chooseOrganisation = (organisationId) => {
		this.props.clearSearch();
		this.props.setOrganisationFilter(organisationId);
		this.closeOrganisationMenu();
	}

	openMobileMenu = (element) => {
		this.setState({ mobile_menu_anchor: element });
	}

	closeMobileMenu = () => {
		this.setState({ mobile_menu_anchor: null });
	}

	chooseMobile = (mobileId) => {
		this.props.setMobileFilter(mobileId);
		this.closeMobileMenu();
	}

	openRouteMenu = (element) => {
		this.setState({ route_menu_anchor: element });
	}

	closeRouteMenu = () => {
		this.setState({ route_menu_anchor: null });
	}

	chooseRoute = (routeId) => {
		this.props.setRouteFilter(routeId);
		this.closeRouteMenu();
	}

	render() {
		const {
			classes, organisations, organisationLookup, organisationFilter,
			clearOrganisationFilter, mobiles, mobileLookup, mobileFilter, clearMobileFilter,
			routes, routeLookup, routeFilter, clearRouteFilter,
			searchType, postcode, distance, toggleGPS, postcodeSearch, clearSearch, setDistance
		} = this.props;

		const countries = new Set(organisations.map(org => org.country));

		return (
			<>
				<Typography component='h2' variant='h6' color='secondary' className={classes.title}>Your mobile service</Typography>
				<Typography component='p' variant='body1' color='secondary' className={classes.subtitle}>Find services within {distance / 1609} mile(s)</Typography>
				<div className={classes.search}>
					<PostcodeSearch
						postcode={postcode}
						distance={distance}
						searchType={searchType}
						toggleGPS={toggleGPS}
						setDistance={setDistance}
						postcodeSearch={postcodeSearch}
						clearSearch={clearSearch}
					/>
				</div>
				<Typography component='p' variant='body1' color='secondary' className={classes.subtitle}>Or, choose your library service</Typography>
				<div className={classes.search}>
					{organisationFilter.length === 0 ? (
						<Tooltip title="Choose library service">
							<Button color="secondary" className={classes.button} onClick={(e) => this.openOrganisationMenu(e.currentTarget)}>
								<BusinessIcon className={classes.leftIcon} />Select service
						</Button>
						</Tooltip>
					) :
						<Chip className={classes.chip} color="primary" variant="outlined" onDelete={clearOrganisationFilter} label={organisationLookup[organisationFilter[0]].name} />
					}
					{organisationFilter.length > 0 ?
						(mobileFilter.length === 0 ?
							<Tooltip title="Choose mobile library">
								<Button color="secondary" className={classes.button} onClick={(e) => this.openMobileMenu(e.currentTarget)}>
									<DirectionBusIcon className={classes.leftIcon} />Select mobile
								</Button>
							</Tooltip> :
							<Chip className={classes.chip} color="primary" variant="outlined" onDelete={(e) => clearMobileFilter()} label={mobileLookup[mobileFilter[0]].name} />
						)
						: null}
					{mobileFilter.length > 0 ?
						(routeFilter.length === 0 ?
							<Tooltip title="Choose route">
								<Button color="secondary" className={classes.button} onClick={(e) => this.openRouteMenu(e.currentTarget)}>
									<DirectionsIcon className={classes.leftIcon} />Select route
										</Button>
							</Tooltip> :
							<Chip className={classes.chip} color="primary" variant="outlined" onDelete={(e) => clearRouteFilter()} label={routeLookup[routeFilter[0]].name} />
						)
						: null}
				</div>
				<Menu
					id="menu-library-service"
					anchorEl={organisation_menu_anchor}
					keepMounted
					open={Boolean(organisation_menu_anchor)}
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
					anchorEl={mobile_menu_anchor}
					keepMounted
					open={Boolean(mobile_menu_anchor)}
					onClose={() => this.closeMobileMenu()}
				>
					{mobiles
						.filter(mob => {
							let display = true;
							if (organisationFilter.length > 0 &&
								organisationFilter.indexOf(mob.organisationId) === -1) {
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
					anchorEl={route_menu_anchor}
					keepMounted
					open={Boolean(route_menu_anchor)}
					onClose={() => this.closeRouteMenu()}
				>
					{routes
						.filter(route => {
							let display = true;
							if (mobileFilter.length > 0 &&
								mobileFilter.indexOf(route.mobileId) === -1) {
								display = false;
							}
							return display;
						})
						.sort((a, b) => a.name.localeCompare(b.name))
						.map(route => {
							return <MenuItem key={'mnu_itm_route_' + route.id} onClick={() => this.chooseRoute(route.id)}>{route.name}</MenuItem>
						})}
				</Menu>
			</>
		);
	}
}

Filters.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(Filters);