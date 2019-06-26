// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// MUI Icons
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

const styles = theme => ({
	card: {
		position: 'relative',
		minWidth: 275,
		border: '1px solid rgba(0, 0, 0, 0.12)'
	},
	title: {
		fontSize: 12,
		fontWeight: 500
	},
	fab: {
		position: 'absolute',
		top: theme.spacing(2),
		right: theme.spacing(2)
	},
	verticalDivider: {
		width: 1,
		height: 28,
		margin: 8
	}
});

class OrganisationFilterCard extends Component {
	state = {
		menu_anchor: null
	};

	openMenu = (element) => this.setState({ menu_anchor: element });

	closeMenu = () => this.setState({ menu_anchor: null });

	chooseOrganisation = (organisation_id) => {
		this.props.setOrganisationFilter(organisation_id);
		this.closeMenu();
	}

	render() {
		const { classes, displayStopLink, organisations, organisation_lookup, organisation_filter, clearOrganisationFilter } = this.props;
		return (
			<Card className={classes.card} elevation={0}>
				{organisation_filter.length === 0 ?
					<Fab color="primary" size="small" aria-label="Add" className={classes.fab} onClick={(event) => this.openMenu(event.currentTarget)}>
						<AddIcon />
					</Fab> :
					<Fab color="secondary" size="small" aria-label="Clear" className={classes.fab} onClick={() => clearOrganisationFilter()}>
						<ClearIcon />
					</Fab>}
				<CardContent>
					<Typography className={classes.title} color="textSecondary" gutterBottom>{organisations.length + ' library services'}</Typography>
					{organisation_filter && organisation_filter.length > 0 ?
						<Typography variant="h6" component="h2">{organisation_lookup[organisation_filter[0]].name}</Typography>
						: null}
				</CardContent>
				{organisation_filter && organisation_filter.length > 0 ?
					<React.Fragment>
						<Divider variant="middle" />
						<CardActions>
							{displayStopLink ? <Tooltip title="Library service stops">
								<Button size="small" color="primary" className={classes.button} onClick={() => this.props.viewStopsByOrganisation(organisation_lookup[organisation_filter[0]].id)}>
									<LocationOnIcon className={classes.leftIcon} />Stops
								</Button>
							</Tooltip> : null}
							<Divider className={classes.verticalDivider} />
							<Tooltip title="Download PDF timetable for library service">
								<IconButton>
									<PictureAsPdfIcon />
								</IconButton>
							</Tooltip>
						</CardActions>
					</React.Fragment> : <CardContent></CardContent>}
				<Menu
					id="menu-library-service"
					anchorEl={this.state.menu_anchor}
					keepMounted
					open={Boolean(this.state.menu_anchor)}
					onClose={() => this.closeMenu()}
				>
					{organisations.map(org => {
						return <MenuItem key={'mnu_itm_org_' + org.id} onClick={() => this.chooseOrganisation(org.id)}>{org.name}</MenuItem>
					})}
				</Menu>
			</Card >
		);
	}
}

OrganisationFilterCard.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(OrganisationFilterCard);