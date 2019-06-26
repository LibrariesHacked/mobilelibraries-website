// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// Icons
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';

const styles = theme => ({
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
	title: {
		fontSize: 12,
		fontWeight: 500
	},
	fab: {
		position: 'absolute',
		top: theme.spacing(2),
		right: theme.spacing(2)
	}
});

class MobileFilterCard extends Component {
	state = {
		menu_anchor: null
	};

	openMenu = (element) => this.setState({ menu_anchor: element });

	closeMenu = () => this.setState({ menu_anchor: null });

	chooseMobile = (mobile_id) => {
		this.props.setMobileFilter(mobile_id);
		this.closeMenu();
	}

	render() {
		const { classes, mobiles, mobile_lookup, mobile_filter, clearMobileFilter, organisation_lookup, organisation_filter } = this.props;
		const bull = <span className={classes.bullet}>•</span>;
		return (
			<Card className={classes.card} elevation={0}>
				{organisation_filter.length > 0 && mobile_filter.length === 0 ?
					<Fab color="primary" size="small" aria-label="Add" className={classes.fab} onClick={(event) => this.openMenu(event.currentTarget)}>
						<AddIcon />
					</Fab> : null}
				{mobile_filter.length > 0 ?
					<Fab color="secondary" size="small" aria-label="Clear" className={classes.fab} onClick={() => clearMobileFilter()}>
						<ClearIcon />
					</Fab> : null}
				<CardContent>
					<Typography className={classes.title} color="textSecondary" gutterBottom>
						{organisation_filter.length > 0 ? organisation_lookup[organisation_filter[0]].name : 'All services'}
						{bull}
						{mobiles.length + ' mobile libraries'}
					</Typography>
					{mobile_filter && mobile_filter.length > 0 ?
						<Typography variant="h6" component="h2">
							{mobile_lookup[mobile_filter[0]].name}
						</Typography>
						: null}
				</CardContent>
				<CardContent></CardContent>
				<Menu
					id="menu-mobile-library"
					anchorEl={this.state.menu_anchor}
					keepMounted
					open={Boolean(this.state.menu_anchor)}
					onClose={() => this.closeMenu()}
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
				{mobile_filter.length > 0 ?
					<div>
						<Divider variant="middle" />
					</div> : null}
			</Card>
		);
	}
}

MobileFilterCard.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(MobileFilterCard);