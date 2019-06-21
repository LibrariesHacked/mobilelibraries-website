// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// Material UI
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// MUI Icons
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import BusinessIcon from '@material-ui/icons/Business';
import DirectionBusIcon from '@material-ui/icons/DirectionsBus';
import LocationOnIcon from '@material-ui/icons/LocationOn';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const styles = theme => ({
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap'
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		overflowX: 'hidden',
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9) + 1
		}
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar
	},
	listItemIcon: {
		[theme.breakpoints.up('sm')]: {
			paddingLeft: '8px'
		}
	}
});

class AppDrawer extends Component {

	render() {
		const { drawer_open, classes, theme } = this.props;
		return (
			<Drawer
				variant="permanent"
				className={clsx(classes.drawer, {
					[classes.drawerOpen]: drawer_open,
					[classes.drawerClose]: !drawer_open,
				})}
				classes={{
					paper: clsx({
						[classes.drawerOpen]: drawer_open,
						[classes.drawerClose]: !drawer_open,
					}),
				}}
				open={drawer_open}
			>
				<div className={classes.toolbar}>
					<IconButton onClick={this.props.closeDrawer}>
						{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
					</IconButton>
				</div>
				<Divider />
				<List>
					<ListItem button onClick={() => this.props.setDashboard('organisations')}>
						<ListItemIcon className={classes.listItemIcon}><BusinessIcon /></ListItemIcon>
						<ListItemText primary="Organisations" />
					</ListItem>
					<ListItem button onClick={() => this.props.setDashboard('mobiles')}>
						<ListItemIcon className={classes.listItemIcon}><DirectionBusIcon /></ListItemIcon>
						<ListItemText primary="Mobiles" />
					</ListItem>
					<ListItem button onClick={() => this.props.setDashboard('stops')}>
						<ListItemIcon className={classes.listItemIcon}><LocationOnIcon /></ListItemIcon>
						<ListItemText primary="Stops" />
					</ListItem>
				</List>
			</Drawer>
		);
	}
}

AppDrawer.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(AppDrawer);